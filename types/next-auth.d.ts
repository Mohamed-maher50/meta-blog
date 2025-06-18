// types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;

    email: string;
    bio?: string;
    description?: string;
    jopTitle?: string;
    image: string;
  }
  interface JWT {
    id: string;
    role?: string;
  }
}
