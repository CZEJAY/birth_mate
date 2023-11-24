import useCurrentUser from "@/hooks/useCurrentUser";
import User, { Conversation } from "@/lib/models/user.model"

const getConversations = async () => {
    try {
      const user = await useCurrentUser();
  
      if (!user?.id) {
        return [];
      }
  
      const conversations = await Conversation.find({
        'users': user._id
      })
      .sort({ lastMessageAt: 'desc' })
      .populate({
        path: 'users',
        model: 'User' // Adjust the model name as per your project
      })
      .populate({
        path: 'messages',
        model: 'Message', // Adjust the model name as per your project
        populate: {
          path: 'sender seen',
          model: 'User' // Adjust the model name as per your project
        }
      })
      .exec();
  
      return conversations as any;
    } catch (error) {
      //console.error(error);
      return [];
    }
  };

export default getConversations