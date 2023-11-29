// import getCurrentUser from "@/app/actions/getCurrentUser";
import useCurrentUser from "@/hooks/useCurrentUser";
import { NextResponse } from "next/server";

import User, { Conversation, Message } from "@/lib/models/user.model";
// import prisma from "@/app/libs/prismadb";

import { pusherServer } from "@/lib/pusher";
import { connectToDB } from "@/lib/mongoose";

export async function POST(request: Request) {
  try {
    await connectToDB();
    const currentUser = await useCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;
    const friendId = await User.findOne({ id: userId });
    if (!currentUser?.id || !currentUser?.username) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (isGroup) {
      //console.log("IsGroup:", members);

      const newConversation = await Conversation.create({
        name,
        isGroup,
        users: [
          ...members.map((member: { value: string }) => member.value),
          currentUser._id,
        ],
      }).then((data) => {
        return data.populate("users");
      });

      // Update all connections with new conversation
      newConversation.users.forEach((user: any) => {
        if (user.id) {
          pusherServer.trigger(user.id, "conversation:new", newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }

    if (!isGroup && (!members || !name)) {
      // For one-on-one conversations, check if a conversation with the same users exists
      const existingConversation = await Conversation.findOne({
        users: { $all: [currentUser._id, friendId._id] },
      }).populate('users')

      if (existingConversation) {
        return NextResponse.json(existingConversation);
      }

      // If not, create a new one-on-one conversation
      const newConversation = await Conversation.create({
        users: [
           currentUser._id,
           friendId._id
        ]
      }).then((data) => {
        if (!data) {
          throw new Error("Failed to create conversation");
        }
        return data.populate('users');
      });

      if (!newConversation) {
        throw new Error("Failed to populate users in conversation");
      }
      console.log("New Conversation:", newConversation);
      // Update all connections with the new conversation
      newConversation.users.forEach((user: any) => {
        if (user.id) {
          pusherServer.trigger(user.id, "conversation:new", newConversation);
        }
      });
      return NextResponse.json(newConversation);
    }
  } catch (error) {
    console.log("Conver Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
