import { pusherServer } from "@/lib/pusher";
import { currentUser } from "@clerk/nextjs";
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  request: NextApiRequest, 
  response: NextApiResponse
) {
  const session = await currentUser()

  if (!session?.id) {
    return response.status(401);
  }

  const socketId = request.body.socket_id;
  const channel = request.body.channel_name;
  const data = {
    user_id: session?.id,
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
  return response.send(authResponse);
};
