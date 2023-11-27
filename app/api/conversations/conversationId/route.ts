
import { NextResponse } from "next/server";

import User,  { IUser, Conversation, Message } from "@/lib/models/user.model";
import { pusherServer } from "@/lib/pusher";
import useCurrentUser from "@/hooks/useCurrentUser";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const body = await request.json()
    const { conversationId } = body;
    const currentUser = await useCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    const existingConversation = await Conversation.findOne({
      _id: conversationId
    })
    .populate('users')
    .exec();

    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const deletedConversation = await Conversation.deleteMany({
      _id: conversationId,
      userIds: currentUser.id
    }).then(async() => {
      await Message.deleteMany({ conversationId });
    });

    existingConversation.users.forEach((user: any) => {
      if (user.id) {
        pusherServer.trigger(user.id, 'conversation:remove', existingConversation);
      }
    });

    return NextResponse.json(deletedConversation)
  } catch (error) {
    //console.log(error);
    return NextResponse.json(null);
  }
}