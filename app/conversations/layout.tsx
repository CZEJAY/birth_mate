import Sidebar from "@/components/sidebar/Sidebar"
import { ReactNode } from "react"
import "../globals.css"
import ConversationList from "./components/ConversationList"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { ClerkProvider, currentUser } from "@clerk/nextjs"
import getConversations from "@/lib/actions/getConverstions"
import { dark } from "@clerk/themes"
import ActiveStatus from "@/components/ActiveStatus"

export default async function ConversationLayout({
    children
}:{
    children: ReactNode
}){
    const user = await currentUser()
    const { users } = await fetchUsers({userId: user?.id || ""})
    const conversation = await getConversations()
    const fetchedUser = await fetchUser( user?.id as string)
    const data = JSON.parse(JSON.stringify(conversation))
    const parsedUser = JSON.parse(JSON.stringify(fetchedUser))
    return(
        <html lang="en">
            <body className="h-screen">
                <ClerkProvider
                    appearance={{
                        baseTheme: dark,
                    }}
                >
                        <ActiveStatus />
                    <Sidebar>
                        <div className="h-full">
                            {
                                <ConversationList 
                                currentUserNow={parsedUser}
                                users={users} 
                                title="Messages" 
                                initialItems={data}
                            />}
                            {children}
                        </div>
                    </Sidebar>
                </ClerkProvider>
            </body>
        </html>
    )
}