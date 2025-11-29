import NextAuth, { NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github"; // optional
import GoogleProvider from "next-auth/providers/google"; // optional
import CredentialsProvider from "next-auth/providers/credentials"; // optional
import { loginSchema } from "@/schema/authSchema";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { generateToken, sendVerificationEmail } from "./lib/VerificationEmail";
import { prisma } from "@/prisma";
import type { Adapter } from "next-auth/adapters";
export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          type: "password",
          name: "Password",
        },
      },
      async authorize(credentials) {
        const validationResult = loginSchema.parse(credentials);
        const user = await prisma.user.findUnique({
          where: {
            email: validationResult.email,
          },
        });
        if (!user) return null;
        return {
          email: user.email,
          id: user.id,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
          isFirstVisit: user.isFirstVisit,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  events: {
    linkAccount: async ({ user }) => {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account && account.provider == "credentials") {
        return true;
        const newToken = await generateToken(user.email);
        if (!user.emailVerified) {
          await sendVerificationEmail(newToken);
          return `/auth/signin?error=${encodeURIComponent(
            `verificationError`
          )}`;
        }
      }

      return true;
    },

    jwt({ token, user, trigger, session }) {
      // after signin will go to jwt and return token data
      if (trigger === "update" && session.image) token.image = session.image;
      if (trigger === "update" && session.topicsSelected)
        token.isFirstVisit = !session.topicsSelected;
      if (user)
        return {
          ...token,
          userId: user.id,
          image: user.image,
          isFirstVisit: user.isFirstVisit,
        };
      return token;
    },
    async session({ session, token }) {
      if (session && session.user) {
        session.user.userId = token.userId;
        session.user.image = token.image;
        session.user.isFirstVisit = token.isFirstVisit;
        return session;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  trustHost: process.env.AUTH_TRUST_HOST === "true",
};
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
