import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
const authPages = ["/auth/signin", "/auth/signUp"];
export default auth((req) => {
  const newUrl = new URL("/", req.nextUrl.origin);
  if (authPages.includes(req.nextUrl.pathname) && req.auth)
    return Response.redirect(newUrl);
  return NextResponse.next();
});
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
