"use client"

import { FC } from "react"
import { useStore } from "@/hooks/store/inputStore";

interface ReplyModalProps {
        
}
const ReplyModal: FC<ReplyModalProps> = ({

}) => {
    const { isInputFocused, data } = useStore()
  return ( 
    <div 
        className={`${isInputFocused ? "block" : "hidden"}  flex w-full bg-gray-200 p-2 rounded-lg rounded-b-none`}
    >
        <span className="text-small-medium">Replying to: {data?.sender?.name}</span>
    </div>
  )
}

export default ReplyModal