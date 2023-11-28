import Sidebar from "@/components/sidebar/Sidebar";
import {fetchUsers} from "@/lib/actions/user.actions";
// import Sidebar from "../components/sidebar/Sidebar";
import UserList from "./components/UserList";
import { currentUser } from "@clerk/nextjs";
import "../globals.css"

export default async function UsersLayout({
  children
}: {
  children: React.ReactNode,
}) {
  const user = await currentUser()
  const {users} = await fetchUsers({userId: user?.id || ""});
  // //console.log(users);
  

  return (
    <html lang="en">
      <body className="bg-dark-1" >
        <Sidebar>
          <div className="h-full ">
            <UserList items={users} />
            {children}
          </div>
        </Sidebar>
      </body>
    </html>
  );
}
