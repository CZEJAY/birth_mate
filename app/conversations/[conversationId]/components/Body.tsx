'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { pusherClient } from "@/lib/pusher";
import useConversation from "@/hooks/useConversation";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/types";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  //console.log("Line 19 Body.tsx", initialMessages);
  
  
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/conversationId/seen`, {
      conversationId: conversationId,
    });
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/conversationId/seen`,{
        conversationId: conversationId,
      });

      setMessages((current) => {
        if (find(current, { id: message._id })) {
          return current;
        }

        return [...current, message]
      });
      
      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage._id === newMessage._id) {
          return newMessage;
        }
  
        return currentMessage;
      }))
    };
  

    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId]);

  return ( 
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox 
          isLast={i === messages.length - 1} 
          key={message._id} 
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
}
 
export default Body;