import {  IConversation as Conversation, IMessage as Message, IUser as User } from "@/lib/models/user.model";

export type FullMessageType = Message & {
  sender: User, 
  seen: User[]
};

export type FullConversationType = Conversation & { 
  users: User[]; 
  messages: FullMessageType[]
};
