// types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: {
        url: string;
        width: number;
        height: number;
      };
      userId: string;
    };
  }

  interface User {
    id: string;
    email: string;
    bio?: string;
    description?: string;
    jopTitle?: string;
    image: {
      url: string;
      width: number;
      height: number;
    };
  }
  interface JWT {
    id: string;
    userId: string;
    image?: {
      url: string;
      width: number;
      height: number;
    };
  }
}
