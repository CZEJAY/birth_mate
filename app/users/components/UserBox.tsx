import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {  IUser } from "@/lib/models/user.model";

import Avatar from "@/components/Avatar";
import LoadingModal from "@/components/modals/LoadingModal";

interface UserBoxProps {
  data: IUser
}

const UserBox: React.FC<UserBoxProps> = ({ 
  data
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios.post('/api/conversations', { userId: data.id })
    .then((data) => {
      router.push(`/conversations/${data.data._id}`);
    })
    .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <>
      {isLoading && (
        <LoadingModal />
      )}
      <div
        onClick={handleClick}
        className="
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          bg-inherit
          p-3 
          hover:bg-neutral-100/40
          rounded-lg
          transition
          cursor-pointer
        "
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-light-1">
                {data.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
 
export default UserBox;