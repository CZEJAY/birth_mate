'use client';

import { HiChevronLeft } from 'react-icons/hi'
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import { useMemo, useState } from "react";
import Link from "next/link";
import { IConversation as Conversation, IUser as User } from "@/lib/models/user.model";

import useOtherUser from "@/hooks/useOtherUser";
import useActiveList from "@/hooks/useActiveList";

import Avatar from "@/components/Avatar";
import AvatarGroup from "@/components/AvatarGroup";
import ProfileDrawer from "./ProfileDrawer";

interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  //console.log("Members:", members);
  
  const isActive = members.indexOf(otherUser?.id!) !== -1;
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline'
  }, [conversation, isActive]);

  return (
  <>
    <ProfileDrawer 
      data={conversation} 
      isOpen={drawerOpen} 
      onClose={() => setDrawerOpen(false)}
    />
    <div 
      className="
        bg-dark-1 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm
      "
    >
      <div className="flex gap-3 items-center">
        <Link
          href="/conversations" 
          className="
            lg:hidden 
            block 
            text-primary-500 
            hover:text-primary-500/90 
            transition 
            cursor-pointer
          "
        >
          <HiChevronLeft size={32} />
        </Link>
        {conversation.isGroup ? (
          <AvatarGroup users={conversation.users} />
        ) : (
          <Avatar user={otherUser} />
        )}
        <div className="flex flex-col">
          <div className='text-light-1'>{conversation.name || otherUser.name}</div>
          <div className="text-sm font-light text-neutral-200">
            {statusText}
          </div>
        </div>
      </div>
      <HiEllipsisHorizontal
        size={32}
        onClick={() => setDrawerOpen(true)}
        className="
          text-primary-500
          cursor-pointer
          hover:text-primary-500/90
          transition
        "
      />
    </div>
    </>
  );
}
 
export default Header;
