import Sidebar from "@/components/sidebar/Sidebar"
import { ReactNode } from "react"
import "../globals.css"
import ConversationList from "./components/ConversationList"
import { fetchUsers } from "@/lib/actions/user.actions"
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
    const data = JSON.parse(JSON.stringify(conversation))
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