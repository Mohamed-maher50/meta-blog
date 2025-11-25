import PusherClient from "pusher-js";
import PusherServer from "pusher";

let pusherClientInstance: PusherClient;
export const getPusherClient = () => {
  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient("93f36c93e8da669835ec", {
      cluster: "eu",
      authEndpoint: "/api/pusher/auth",
    });
  }
  return pusherClientInstance;
};

let pusherServerInstance: PusherServer;
export const getPusherServer = () => {
  if (!pusherServerInstance) {
    pusherServerInstance = new PusherServer({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }
  return pusherServerInstance;
};
