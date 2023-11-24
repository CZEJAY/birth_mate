import useCurrentUser from "@/hooks/useCurrentUser";
import { Conversation } from "../models/user.model";

const getConversationById = async (conversationId: any) => {
    try {
      const currentUser = await useCurrentUser();
  
      if (!currentUser?.id) {
        return null;
      }
  
      const conversation = await Conversation.findOne({
        _id: conversationId
      })
      .populate('users')
      .exec();
  
      return conversation;
    } catch (error) {
      //console.error(error, 'SERVER_ERROR');
      return null;
    }
  };
  
  export default getConversationById;