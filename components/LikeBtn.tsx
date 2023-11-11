"use client"
import { checkIsLiked } from '@/lib/utils';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import axios from 'axios';

type PostStatsProps = {
    post: {
        likes: string[],
        _id: string
    }
    userId: string;
  };

const LikeBtn =  ({ post, userId}: PostStatsProps) => {
    //@ts-ignore
    const likesList = post?.likes?.map((user: any) => user);
    
    const [likes, setLikes] = useState<string[]>(likesList);
    
    
    
    const handleLikePost = async (
        e: React.MouseEvent<HTMLImageElement, MouseEvent>
        ) => {
        //   const likePost  =  await useLikePost();
        e.stopPropagation();
    
        let likesArray = [...likes];
    
        if (likesArray.includes(userId?.toString())) {
          likesArray = likesArray.filter((Id) => Id?.toString() !== userId?.toString());
        } else {
          likesArray.push(userId?.toString());
        }
    
        setLikes(likesArray);
        // likePost({ postId: post._id, likesArray });s
        axios.post("/api/react", {
            postId: post._id,
            likesArray
        })
      };
  return (
    <div onClick={handleLikePost} className='flex items-center gap-1'>
        <Image
        src={
          checkIsLiked(likes, userId?.toString()) ? 
          "/assets/heart-filled.svg"
          : "/assets/heart-gray.svg"
        }
        alt='heart'
        width={24}
        height={24}
        className='cursor-pointer object-contain'
        />
        <small className="text-light-1  text-tiny-medium">
            {likes.length} 
        </small>
    </div>
  )
}

export default LikeBtn