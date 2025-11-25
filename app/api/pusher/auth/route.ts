import { AppError, ErrorHandler } from "@/lib/GlobalErrorHandler";
import { pusherServer } from "@/lib/pusherClinet";
import { requireAuth } from "@/lib/utils";
export const POST = async (req: Request) => {
  try {
    const raw = await req.text();
    const params = new URLSearchParams(raw);
    const token = await requireAuth(req);
    const socket_id = params.get("socket_id");
    const channel_name = params.get("channel_name");
    if (!socket_id || !channel_name) throw new AppError("Invalid params", 400);
    if (channel_name.startsWith("private-user")) {
      const userId = channel_name.replace("private-user-", "");
      if (userId != token.userId) throw new AppError("Forbidden", 403);
      const authResponse = pusherServer.authorizeChannel(
        socket_id!,
        channel_name!
      );
      return Response.json(authResponse);
    } else {
      throw new AppError("Forbidden", 403);
    }
  } catch (error) {
    return Response.json(...ErrorHandler(error, false));
  }
};
