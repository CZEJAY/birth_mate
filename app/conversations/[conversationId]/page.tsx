import getConversationById from "@/lib/actions/getConversationById";
import getMessages from "@/lib/actions/getMessages";

import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import EmptyState from "@/components/EmptyState";

interface IParams {
  conversationId: string;
}

const ChatId = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);
  // //console.log("convo", conversation);
  const convoData = JSON.parse(JSON.stringify(conversation))
  const convoMsg = JSON.parse(JSON.stringify(messages))
  //console.log("Line 19 page.tsx", messages);
  
  

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    )
  }

  return ( 
    <div className="lg:pl-80 h-full bg-dark-1">
      <div className="h-full flex flex-col">
        <Header conversation={convoData} />
        <Body initialMessages={convoMsg} />
        <Form />
      </div>
    </div>
  );
}

export default ChatId;