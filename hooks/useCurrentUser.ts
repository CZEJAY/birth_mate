import User, { IUser } from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { currentUser } from "@clerk/nextjs";


const useCurrentUser = async () => {
    //console.log("useCurrentUser Hook:", "Entered")

    try {
        await connectToDB()
        const user = await currentUser()
        const dbUser = await User.findOne({id: user?.id})
        if(!dbUser){
            return null
        }
        return dbUser as IUser
    } catch (error) {
        //console.log("useCurrentUser Hook:", error)
        return error as IUser
    }
}

export default useCurrentUser