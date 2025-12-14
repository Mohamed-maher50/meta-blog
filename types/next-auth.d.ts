// types/next-auth.d.ts
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
// interface User {
//   id: string;
//   email: string;
//   name?: null | string;
//   bio?: string;
//   jopTitle?: string;
//   image: string | null;
//   emailVerified: DateTime | null;
//   isFirstVisit?: boolean;
// }
export type ExtendedUser = DefaultSession["user"] & {
  image: string;
  isOAuth: boolean;
};
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    userId: string;
    image?: string | null;
    email: string;
    name?: null | string;
    isFirstVisit: boolean;
  }
}
// declare module "next-auth" {
//   interface User {
// id: string;
// email: string;
// name?: null | string;
// bio?: string;
// jopTitle?: string;
// image: string | null;
// emailVerified: DateTime | null;
// isFirstVisit?: boolean;
//   }
// }

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image?: string | null;
      userId: string;
      isFirstVisit?: boolean;
    };
  }
}
