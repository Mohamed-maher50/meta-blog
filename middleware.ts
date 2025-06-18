import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
const authPages = ["/auth/signin", "/auth/signUp"];
const protectedPages = ["/author"];
export default auth((req) => {
  const newUrl = new URL("/", req.nextUrl.origin);
  const isProtectedRoute = protectedPages.some(
    (r) => r == req.nextUrl.pathname
  );
  if (authPages.includes(req.nextUrl.pathname) && req.auth)
    return Response.redirect(newUrl);
  if (!req.auth && isProtectedRoute) {
    const url = req.nextUrl.clone();
    url.pathname = authPages[0];
    return Response.redirect(url);
  }
  return NextResponse.next();
});
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
