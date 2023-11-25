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
    const { conversationId } = body;  

    
    if (!currentUser?.id || !currentUser?.onboarded) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find existing conversation
    const conversation = await Conversation.findOne({
      _id: conversationId
    })
    .populate({
      path: 'messages',
      populate: {
        path: 'seen',
        model: 'User' // Adjust the model name as per your project
      }
    })
    .populate('users')
    .exec();

    if (!conversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // Find last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // Update seen of last message
    const updatedMessage = await Message.findByIdAndUpdate(
      lastMessage._id,
      {
        $addToSet: { 'seen': currentUser._id }
      },
      {
        new: true,
        populate: ['sender', 'seen']
      }
    ).exec();

    // Update all connections with new seen
    await pusherServer.trigger(currentUser.id, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage]
    });

    // If user has already seen the message, no need to go further
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    // Update last message seen
    await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

    return new NextResponse('Success');
  } catch (error) {
    //console.log(error, 'ERROR_MESSAGES_SEEN')
    return new NextResponse('Error', { status: 500 });
  }
}