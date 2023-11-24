
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { IUser as User } from "@/lib/models/user.model";
import { useAuth } from "@clerk/nextjs";

const useOtherUser = (conversation: FullConversationType | { users: User[] }) => {
  const {userId} = useAuth();

  const otherUser = useMemo(() => {
    const currentUserId = userId;

    const otherUser = conversation.users.filter((user) => user.id !== currentUserId);

    return otherUser[0];
  }, [userId, conversation.users]);

  return otherUser;
};

export default useOtherUser;
