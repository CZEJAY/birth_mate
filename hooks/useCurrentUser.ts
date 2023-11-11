import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { currentUser } from "@clerk/nextjs";


export default async function useCurrentUser(){
    console.log("useCurrentUser Hook:", "Entered")

    try {
        await connectToDB()
        const user = await currentUser()
        const dbUser = await User.findOne({id: user?.id})
        // console.log("useCurrentUser Hook:", dbUser)
        return dbUser
    } catch (error) {
        console.log("useCurrentUser Hook:", error)
    }
}