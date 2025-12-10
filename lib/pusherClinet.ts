import PusherClient from "pusher-js";
import PusherServer from "pusher";
PusherClient.logToConsole = false;
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_CLIENT_APP_KEY!,
  {
    cluster: "eu",

    authEndpoint: "/api/pusher/auth",

    forceTLS: true,
    auth: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  }
);
pusherClient.disconnect();

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});
