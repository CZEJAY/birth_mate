import { ReactNode } from "react"
import DesktopSideBar from "./DesktopSideBar"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import MobileFooter from "./MobileFooter"



async function Sidebar({children}: {
    children: ReactNode
}){
    const user = await currentUser()
    const currentUserNow = await fetchUser(user?.id || "")
    return(
        <div className="h-full ">
            <DesktopSideBar currentUser={currentUserNow} />
            <MobileFooter />
            <main className="lg:pl-20 h-full">
                {children}
            </main>
        </div>
    )
}

export default Sidebar