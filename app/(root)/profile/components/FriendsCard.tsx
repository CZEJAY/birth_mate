import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface FriendsCardProps {
    friends: {
        image: string,
        name: string,
        username: string,
        id: string
    }
}

const FriendsCard: React.FC<FriendsCardProps> = ({
    friends
}) => {
  return (
    <div className="flex bg-dark-4 w-full p-1 py-2 rounded-lg">
        <div className="flex flex-col items-center">
            <Link className="flex items-center gap-2" href={`profile/${friends.id}`}>
            <Image src={friends.image} alt="profile" width={50} height={50} className="rounded-full" />
            <p className="text-gray-500 text-small-medium hover:underline">@{friends.username}</p><br />
           </Link>
           <div className="">
           <p className="text-light-2 ml-3 text-small-medium">{friends.name}</p>
           </div>
        </div>
        <div className="flex items-center gap-2 ml-auto self-baseline">
        <Button variant={"ghost" } className="rounded-lg
        text-white text-center py-2 mt-3
        cursor-pointer
        duration-200
        ">Unfriend</Button>
        <Button className="
        hover:bg-primary-500 rounded-lg
        text-white text-center py-2 mt-3
        cursor-pointer
        duration-200
        ">Chat</Button>
        </div>
    </div>
  )
}

export default FriendsCard