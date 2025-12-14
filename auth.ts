import NextAuth, {
  AuthError,
  CredentialsSignin,
  NextAuthConfig,
} from "next-auth";
import GitHubProvider from "next-auth/providers/github"; // optional
import GoogleProvider from "next-auth/providers/google"; // optional
import CredentialsProvider from "next-auth/providers/credentials"; // optional
import { loginSchema } from "@/schema/authSchema";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { verifyHashed } from "./lib/utils";
import { prisma } from "./prisma";
class InvalidLoginError extends CredentialsSignin {
  code = "Email or Password not correct";
}
export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
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
        try {
          const validationResult = loginSchema.safeParse(credentials);

          if (!validationResult.success) throw new InvalidLoginError();
          const user = await prisma.user.findUnique({
            where: {
              email: validationResult.data.email,
            },
          });

          if (!user || !user.password) throw new InvalidLoginError();

          const isVerified = await verifyHashed(
            validationResult.data.password,
            user.password
          );
          if (!isVerified) throw new InvalidLoginError();

          return {
            email: user.email,
            id: user.id,
            name: user.name,
            image: user.image,
            emailVerified: user.emailVerified,
            isFirstVisit: user.isFirstVisit,
          };
        } catch (error) {
          if (error instanceof AuthError) throw error;
          throw new InvalidLoginError();
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  events: {
    // linkAccount: async ({ user }) => {
    //   await prisma.user.update({
    //     where: {
    //       id: user.id,
    //     },
    //     data: {
    //       emailVerified: new Date(),
    //     },
    //   });
    // },
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user, trigger, session, profile, account }) {
      // after signin will go to jwt and return token data
      if (trigger === "update" && session.image) token.image = session.image;
      if (trigger === "update" && session.topicsSelected)
        token.isFirstVisit = !session.topicsSelected;

      if (user)
        return {
          ...token,
          userId: user.id || "",
          image: user.image,
          isFirstVisit: token.isFirstVisit,
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
