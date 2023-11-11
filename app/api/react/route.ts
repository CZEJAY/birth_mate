import { NextResponse, NextRequest } from "next/server"
import User from "@/lib/models/user.model"
import Thread from "@/lib/models/thread.model"

export async function POST(req: NextRequest){
    try {
        const body = await req.json()
        const { postId, likesArray } = body
         await Thread.findByIdAndUpdate(
            postId,
            { $set: { likes: likesArray } },
            { new: true }
        );

        return NextResponse.json({message: "Updated"}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json("Internal server error", {status: 500})        
    }
}