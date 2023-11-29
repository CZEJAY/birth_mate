"use client"

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from "clsx";
import { find, uniq } from 'lodash';
import { useAuth } from "@clerk/nextjs";

import useConversation from "@/hooks/useConversation";
import { pusherClient } from "@/lib/pusher";
import GroupChatModal from "@/components/modals/GroupChatModal";
import ConversationBox from "./ConversationBox";
import { FullConversationType } from "@/types";
import { IUser as User } from "@/lib/models/user.model"
import Avatar from "@/components/Avatar";
import SettingsModal from "@/components/sidebar/SettingsModal";
import axios from "axios";
import LoadingModal from "@/components/modals/LoadingModal";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  currentUserNow: User;
  title?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  initialItems, 
  users,
  currentUserNow,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(currentUserNow)
  const router = useRouter();
  
  const session = useAuth()

  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.userId
  }, [session.userId])
  // @ts-ignore

  useEffect(() => {
    if (!pusherKey) {
      return;
    }
    //@ts-ignore
    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) => current.map((currentConversation) => {
        if (currentConversation._id === conversation._id) {
          return {
            ...currentConversation,
            messages: conversation.messages
          };
        }

        return currentConversation;
      }));
    }

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { _id: conversation._id })) {
          return current;
        }

        return [conversation, ...current]
      });
    }

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo._id !== conversation._id)]
      });
    }

    pusherClient.bind('conversation:update', updateHandler)
    pusherClient.bind('conversation:new', newHandler)
    pusherClient.bind('conversation:remove', removeHandler)
  }, [pusherKey, router]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback((data: any) => {
    setIsLoading(true);

    axios.post('/api/conversations', { userId: data.id })
    .then((data: any) => {
      router.push(`/conversations/${data.data._id}`);
    })
    .finally(() => setIsLoading(false));
  }, [router]);

  return (
    <>
      {isLoading && (
        <LoadingModal />
      )}
      <SettingsModal currentUser={currentUser} isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <GroupChatModal 
        users={users} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
      {/* <Avatar /> */}
      <aside className={clsx(`
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:bg-dark-2 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
      `, isOpen ? 'hidden' : 'block w-full left-0')}>
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-light-1">
              Messages
            </div>
            
            <div 
              onClick={() => setIsModalOpen(true)} 
              className="
                rounded-full 
                h-9 w-9 mr-4
                p-2 ml-auto
                bg-gray-100 
                text-gray-600 
                cursor-pointer 
                hover:opacity-75 
                transition
              ">
              <MdOutlineGroupAdd size={20} />
            </div>
              <div 
              onClick={() => setIsSettingsOpen(true)}
               className="block lg:hidden cursor-pointer hover:opacity-75 transition-all duration-300">
                <Avatar 
                  user={currentUser}
                />
              </div>
          </div>
          <div className="flex relative lg:hidden gap-3 justify-evenly mb-1 bg-gray-900/50 items-center py-7 px-1 rounded-lg overflow-hidden">
            {
              users.map((user) => (
                <div 
                onClick={() => handleClick(user)} 
                key={user._id} 
                title={user.name} 
                
                className="relative flex flex-col lg:hidden cursor-pointer hover:opacity-75 transition-all duration-300">
                  <Avatar
                  key={user._id}
                  user={user}
                />
                  <p className="text-tiny-medium truncate absolute -bottom-5 text-gray-100">{user.name}</p>
                </div>
              ))
            }
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item._id}
              data={item}
              selected={conversationId === item._id}
            />
          ))}
        </div>
      </aside>
    </>
   );
}
 
export default ConversationList;
