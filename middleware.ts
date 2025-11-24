import { auth } from "@/lib/auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
const authPages = ["/auth/signin", "/auth/signUp"];
const protectedPages = ["/author", "/blogs/new", "/topics/choose"];
export default auth(async (req) => {
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
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token && token.isFirstVisit && req.nextUrl.pathname != "/topics/choose")
    return Response.redirect(new URL("/topics/choose", req.nextUrl.origin));
  return NextResponse.next();
});
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
