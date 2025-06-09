import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import GitHubProvider from "next-auth/providers/github"; // optional
import GoogleProvider from "next-auth/providers/google"; // optional
import CredentialsProvider from "next-auth/providers/credentials"; // optional

export const { auth, handlers, signIn } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: (process.env.GITHUB_ID as string) || "",
      clientSecret: (process.env.GITHUB_SECRET as string) || "",
    }),
    GoogleProvider({
      clientId: (process.env.GOOGLE_ID as string) || "",
      clientSecret: (process.env.GOOGLE_SECRET as string) || "",
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
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });
        if (!user) return null;
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // async signIn(props) {
    //   console.log(props);
    //   return false;
    // },
    // async jwt({ token, user }) {
    //   console.log(user);
    //   token.picture = user.image;
    //   token.email = user.email;
    //   token.name = user.name;
    //   return token;
    // },
  },
  secret: process.env.AUTH_SECRET,
});
