import { NextRequest, NextResponse } from "next/server";
import User, { FriendRequest } from "@/lib/models/user.model";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { connectToDB } from "@/lib/mongoose";



export const POST = async (req: NextRequest) => {
    try {
        await connectToDB()
        const user = await currentUser();
        const body = await req.json();
        const { requestId, status, pathname } = body;
        console.log("Status",status)

        const authDBUser = await User.findOne({ id: user?.id})

        if (!user) {
            return NextResponse.json({ message: "You are not logged in" }, { status: 400 });
        }

        const request = await FriendRequest.findById(requestId);
        
        if (!request) {
            return NextResponse.json({ message: "Friend request not found" }, { status: 404 });
        }

        if (request.receiver.toString() !== authDBUser._id.toString()) {
            return NextResponse.json({ message: "You are not authorized to accept or reject this friend request" }, { status: 401 });
        }

        // Update the status of the FriendRequest document
        request.status = status;
        await request.save();

        if (status === 'accepted') {
            // Add each user to the other's "friends" array
            await User.findByIdAndUpdate(request.sender, { $addToSet: { friend_list: request.receiver } });
            await User.findByIdAndUpdate(request.receiver, { $addToSet: { friend_list: request.sender } });
            return NextResponse.json({ message: "Friend request accepted successfully" }, { status: 200 });
        }

        // Remove the request from both users' "friendRequests" array
        // await User.findByIdAndUpdate(request.sender, { $pull: { friendRequests: request._id } });
        await User.findByIdAndUpdate(request.receiver, { $pull: { friendRequests: request._id } });

        // Delete the friend request document
        await FriendRequest.findByIdAndDelete(requestId);

        // Revalidate the path
        // revalidatePath(pathname);

        return NextResponse.json({ message: "Friend request updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("An error occurred:", error);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
