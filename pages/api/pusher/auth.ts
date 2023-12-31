import { pusherServer } from "@/lib/pusher";
import { currentUser } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  request: NextApiRequest, 
  response: NextApiResponse
) {
  const {userId} = await getAuth(request)

  if (!userId) {
    return response.status(401);
  }

  const socketId = request.body.socket_id;
  const channel = request.body.channel_name;
  const data = {
    user_id: userId,
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
  return response.send(authResponse);
};
