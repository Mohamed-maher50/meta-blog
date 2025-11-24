import PusherClient from "pusher-js";
import PusherServer from "pusher";
PusherClient.logToConsole = true;
export const pusherClient = new PusherClient("93f36c93e8da669835ec", {
  cluster: "eu",

  authEndpoint: "/api/pusher/auth",

  forceTLS: true,
  auth: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});
