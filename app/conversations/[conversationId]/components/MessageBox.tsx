"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FullMessageType } from "@/types";

import Avatar from "@/components/Avatar";
import ImageModal from "./ImageModal";
import { useAuth } from "@clerk/nextjs";
import { Reply } from "lucide-react";
import { useStore } from "@/hooks/store/inputStore";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useAuth();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentSenderId, setCurrentSenderId] = useState(
    data?.sender?.id ?? null
  );
  const { toggleInputFocused } = useStore();
  useStore((state) => state.setData(data))
  // const isReply = Boolean(data.replyTo);
  const isReply = true;

  useEffect(() => {
    //@ts-ignore
    setCurrentSenderId(data?.sender?.id);
  }, [data]);

  const isNextMessageMine = data.sender.id !== currentSenderId;
  const isOwn = session.userId === data?.sender?.id;
  const seenList = (data.seen || [])
    .filter((user) => user?.id !== data?.sender?.id)
    .map((user) => user?.name)
    .join(", ");
  const groupStyles = currentSenderId === data.sender.id;
  const container = clsx("flex items-center gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx("mt-auto", isOwn && "order-2 mt-auto");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit ",
    isOwn ? "bg-primary-500 text-white" : "bg-gray-800 text-primary-500",
    data.image ? "rounded-md p-0" : "rounded-t-full rounded-bl-full py-2 px-3",
    !isOwn && "rounded-t-full rounded-br-full rounded-bl-none",
    isNextMessageMine && "mt-0"
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className={` text-small-medium text-gray-100`}>
            {data.sender.name}
          </div>
          <div className="text-tiny-medium text-gray-400">
            {
              //@ts-ignore
              format(new Date(data?.createdAt), "p")
            }
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              onClick={() => setImageModalOpen(true)}
              src={data.image}
              className="
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              "
            />
          ) : (
            <>
              <div
              onClick={() => toggleInputFocused()}
                className="
              cursor-pointer hover:opacity-75 transition-all relative
              text-light-1"
              >
                {data.body}
                <div className="absolute -bottom-7 !z-[9999999] right-0">
                  <Reply
                  onClick={() => toggleInputFocused()}
                    size={18}
                    className={`${isOwn ? "rotate-180" : ""} text-light-1`}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {isLast && isOwn && seenList.length > 0 && (
          <div
            className="
            text-tiny-medium
            text-gray-400
            "
          >
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
