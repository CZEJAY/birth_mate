import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { profileTabs } from "@/constants";

import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchFriends, fetchRequests, fetchUser } from "@/lib/actions/user.actions";
import { log } from "//console";
import FriendsCard from "../components/FriendsCard";
import { Button } from "@/components/ui/button";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  //@ts-ignore
  const { authDbUser } = await fetchFriends(params.id)
  const {friend_request} = await fetchRequests(params.id)
  if (!userInfo?.onboarded) redirect("/onboarding");

  
  // log(authDbUser)

  return (
    <section>
      <ProfileHeader
        initialStatus={friend_request}
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className='mt-9'>
        <Tabs defaultValue='mates' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === "Posts" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userInfo.threads.length}
                  </p>
                )}
                {tab.label === "Friends" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {authDbUser.friend_list.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value = "mates"}
              className='w-full text-light-1'
            >
              {/* @ts-ignore */}
              <ThreadsTab
                currentUserId={user.id}
                accountId={userInfo.id}
                accountType='User'
              />
            </TabsContent>
            
          ))}


            <TabsContent
              value={"friends"}
              className='w-full text-light-1'
            >
              {/* @ts-ignore */}
              <div className="flex flex-col">
                  {
                      authDbUser.friend_list  && authDbUser.friend_list.length > 0 ? (
                          authDbUser.friend_list.map((friend: any, index: number) => (
                              <div key={index} className="flex  items-center justify-between">
                                <FriendsCard friends ={friend} />
                              </div>
                          ))
                      ) : (
                          <>
                          <p className="text-gray-500 text-center mt-3">No friends yet!</p>
                          <link href={"/search"} className="self-center">
                          <Button className="
                          w-40 hover:bg-primary-500 rounded-lg
                          text-white text-center py-2 mt-3
                          cursor-pointer
                          duration-200 
                          "> Add Friends</Button>
                          </link>
                          </>
                      )
                }
              </div>
            </TabsContent>


        </Tabs>
      </div>
    </section>
  );
}
export default Page;
