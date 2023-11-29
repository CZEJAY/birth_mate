'use client';

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, IUser as User } from "@/lib/models/user.model";
import { format } from "date-fns";
import clsx from "clsx";

import useOtherUser from "@/hooks/useOtherUser";
import AvatarGroup from "@/components/AvatarGroup";
import { FullConversationType } from "@/types";
import Avatar from "@/components/Avatar";
import { useAuth } from "@clerk/nextjs";

interface ConversationBoxProps {
  data: FullConversationType,
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ 
  data, 
  selected 
}) => {
  //console.log("Data", data);
  
  const otherUser = useOtherUser(data);
  const { userId } = useAuth();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data?._id}`);
  }, [data, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const authUserId = useMemo(() => userId,
  [userId]);
  
  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!authUserId) {
      return false;
    }

    return seenArray
      .filter((user) => user.ref === authUserId).length !== 0;
  }, [authUserId, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image';
    }

    if (lastMessage?.body) {
      return lastMessage?.body
    }

    return 'Started a conversation';
  }, [lastMessage]);

  return ( 
    <div
      onClick={handleClick}
      className={clsx(`
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 mb-2
        hover:bg-primary-500/90
        rounded-lg
        transition
        cursor-pointer
        `,
        selected ? 'bg-primary-500' : 'bg-gray-800'
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-light-1">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p 
                className="
                  text-small-medium
                  text-gray-200 
                "
              >
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p 
            className={clsx(`
              truncate 
              text-sm
              font-semibold
              `,
              hasSeen ? 'text-gray-300' : 'text-white font-medium'
            )}>
              {lastMessageText}
            </p>
        </div>
      </div>
    </div>
  );
}
 
export default ConversationBox;
