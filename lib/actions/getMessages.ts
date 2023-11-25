import useCurrentUser from "@/hooks/useCurrentUser";
import { Conversation, Message } from "../models/user.model";
import { connectToDB } from "../mongoose";

const getMessages = async (conversationId: any, status?: boolean) => {
    try {
      await connectToDB()
      const currentUser = await useCurrentUser()
      if (status) {
        const status = await Conversation.find({
          users: { $in: [currentUser?._id] },
        })
        .populate('message')
        return status as any;
      }
      const messages = await Message.find({
        conversationId: conversationId
      })
      .populate('sender seen')
      .sort({ createdAt: 'asc' })
      //console.log("GetMessages:", messages);
      
      return messages as any;
    } catch (error) {
      //console.error(error);
      return [];
    }
  };
  
  export default getMessages;