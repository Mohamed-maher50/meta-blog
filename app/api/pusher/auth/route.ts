// pages/api/pusher/auth.js
import { pusherServer } from "@/lib/pusherClinet";
import { requireAuth } from "@/lib/utils";
export const POST = async (req: Request) => {
  const raw = await req.text();

  const params = new URLSearchParams(raw);
  const token = await requireAuth(req);
  const socket_id = params.get("socket_id");
  const channel_name = params.get("channel_name");
  if (!channel_name) return Response.json("forbidden", { status: 403 });

  if (channel_name.startsWith("private-user")) {
    const userId = channel_name.replace("private-user-", "");
    if (userId != token.userId)
      return Response.json("Forbidden", { status: 403 });
    const authResponse = pusherServer.authorizeChannel(
      socket_id!,
      channel_name!
    );
    return Response.json(authResponse);
  } else {
    return Response.json("Forbidden", { status: 403 });
  }
};
