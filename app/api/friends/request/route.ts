import { NextRequest, NextResponse } from "next/server";
import User, { FriendRequest } from "@/lib/models/user.model";
import { currentUser } from "@clerk/nextjs";
import { connectToDB } from "@/lib/mongoose";



export const POST = async (req: NextRequest) => {
    const user = await currentUser();

    try {
        await connectToDB()
        const body = await req.json();
        const { userId } = body;
        //console.log(userId)
        await connectToDB()

        if (!user) {
            return NextResponse.json({ message: "You are not logged in" }, { status: 400 });
        }

        if (userId === user.id) {
            return NextResponse.json({ message: "You cannot add yourself" }, { status: 422 });
        }

        // Find the user in your database
        const userFriends = await User.findOne({ id: user.id });
        const friendDb = await User.findOne({ id: userId });

        if (!userFriends || !friendDb) {
            return NextResponse.json({ message: "User not found" }, { status: 401 });
        }

        // Check if the friend is already in the user's friend list
        // const isAlreadyFriend = userFriends.friends.includes(userId);
        // const isAlreadyFriendReq = friendDb?.friend_requests?.includes(friendDb._id);

        // if (isAlreadyFriendReq) {
        //     return NextResponse.json({ message: "User is already your friend" }, { status: 400 });
        // }

        // Backend: Handle sending a friend request

        // Create a new FriendRequest document
        const request = new FriendRequest({
            sender: userFriends._id,
            receiver: friendDb._id,
            status: 'pending',
        });
        await request.save();

        // Add the request to the sender's "friendRequests" array
        await User.findByIdAndUpdate(friendDb._id, {
            $addToSet: { friend_requests: request._id },
        });

        return NextResponse.json({ message: "Friend request sent", friendRequestId: request._id }, { status: 200 });
    } catch (error) {
        //console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
};

