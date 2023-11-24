import { Message } from "../models/user.model";
import { connectToDB } from "../mongoose";

const getMessages = async (conversationId: any) => {
    try {
      await connectToDB()
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