import Sidebar from "@/components/sidebar/Sidebar"
import { ReactNode } from "react"
import "../globals.css"

export default async function ConversationLayout({
    children
}:{
    children: ReactNode
}){
    return(
        <html>
            <body className="bg-neutral-800">
                <Sidebar>
                    <div className="h-full">
                        {children}
                    </div>
                </Sidebar>
            </body>
        </html>
    )
}