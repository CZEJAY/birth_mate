import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import { SignOutButton } from "@clerk/nextjs"
import useConversation from "./useConversation";
import { redirect } from "next/navigation";

const useRoutes = () => {
  const pathname = usePathname();
  const router = useRouter()
  const { conversationId } = useConversation();

  const routes = useMemo(() => [
    { 
      label: 'Chat', 
      href: '/conversations', 
      icon: HiChat,
      active: pathname === '/conversations' || !!conversationId
    },
    { 
      label: 'Users', 
      href: '/users', 
      icon: HiUsers, 
      active: pathname === '/users'
    },
    {
      label: 'Logout', 
      onClick: () => redirect("/"),
      href: '#',
      icon: HiArrowLeftOnRectangle, 
    }
  ], [pathname, conversationId]);

  return routes;
};

export default useRoutes;
