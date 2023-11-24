import { NextResponse } from "next/server";
import { pusherServer } from '@/lib/pusher'
import { Conversation, Message } from "@/lib/models/user.model";
import useCurrentUser from "@/hooks/useCurrentUser";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await useCurrentUser();
    const body = await request.json();
    const {
      message,
      image,
      conversationId
    } = body;
    //console.log("Api route messages:", conversationId);

    if (!currentUser?.id || !currentUser?.onboarded) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    

    const newMessage = await Message.create({
      body: message,
      image: image,
      conversationId: conversationId,
      sender: currentUser._id,
      seen: [currentUser._id]
    }).then((data: any) => data.populate('seen sender'))

    
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $set: { lastMessageAt: new Date() },
        $addToSet: { messages: newMessage.id }
      },
      {
        new: true,//@ts-expect-error
        populate: ['users', { path: 'messages', populate: 'seen' }]
      }
    ).exec();

    await pusherServer.trigger(conversationId, 'messages:new', newMessage);
      //@ts-expect-error
    const lastMessage = updatedConversation?.messages[updatedConversation?.messages?.length - 1];
      //@ts-expect-error
    updatedConversation?.users?.map((user: any) => {
      pusherServer.trigger(user.id!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage]
      });
    });

    return NextResponse.json(newMessage)
  } catch (error) {
    //console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}