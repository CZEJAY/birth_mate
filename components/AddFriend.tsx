"use client"

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { Loader, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface FriendProp {
    initialStatus?: string;
    userId: string;
}

const AddFriend: React.FC<FriendProp> = ({
    initialStatus,
    userId
}) => {
    //console.log(initialStatus);
    const router = useRouter()
    
    const [buttonText, setButtonText] = useState("Add Friend");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialStatus === "pending") {
            setButtonText("Pending");
        }
        else if (initialStatus === "accepted") {
            setButtonText("Friends");
        }
        else {
            setButtonText("Add Friend");
        }
    
    }, [initialStatus])


    const handleRequest = async (userId: any) => {
        setIsLoading(true)
            // setButtonText("Friend Request Sent");
            axios.post("/api/friends/request", {
                userId,
            })
            .then(() => {
                router.refresh()
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    
  return (
    <div>
        <Button
         disabled={isLoading || initialStatus === "pending"}
         onClick={() => handleRequest(userId)}
         className="bg-primary-500 text-light-1 disabled:cursor-not-allowed w-32"
        >
            {isLoading ? (<Loader2 className="animate-spin" />) :  buttonText}
        </Button>
    </div>
  )
}

export default AddFriend