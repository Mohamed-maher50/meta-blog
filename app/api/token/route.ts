import { getToken } from "next-auth/jwt";

export async function GET(req: Request) {
  const d = req.headers.get("cookie");
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  return Response.json({
    secretExists: !!process.env.NEXTAUTH_SECRET,
    token,
    cookies: d,
  });
}
