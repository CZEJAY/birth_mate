import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser, getActivity, fetchRequestList } from "@/lib/actions/user.actions";
import Confirm from "./components/Confirm";
import { formatDateString } from "@/lib/utils";


async function Page() {
  const user = await currentUser();
  if (!user) return null;
  

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);
  const { friendRequestList } = await fetchRequestList(userInfo.id);
  // //console.log(friendRequestList.friend_requests.length)
  

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="mb-5 flex-1">
        <h1 className='head-text'>Friend Requests</h1>
        <section className='mt-10 flex flex-col gap-5'>
          {friendRequestList.friend_requests.length > 0 ? (
            <>
              {friendRequestList.friend_requests.map((request: any) => (
                  <article key={request._id} className='activity-card2'>
                    <div className="">
                    <div className="flex items-center gap-2">
                    <Image
                      src={request.sender.image}
                      alt='user_logo'
                      width={20}
                      height={20}
                      className='h-10 w-10 rounded-full object-cover'
                    />
                    <span className="!text-small-regular text-light-1">@{request.sender.username}</span>
                    <span className="!text-small-regular text-light-1">-</span>
                    <span className="text-tiny-medium text-gray-600">{formatDateString(request.createdAt)}</span>
                    </div>
                    <p className='!text-small-regular mt-2 text-light-1'>
                      <span className='mr-1 text-primary-500'>
                        {request.sender.name}
                      </span>{" "}
                      sent you a friend request
                    </p>
                    </div>
                    <div className="flex w-full justify-end mt-3">
                      <Confirm requestId={request._id} />
                    </div>
                  </article>
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>No request yet</p>
          )}
        </section>
      </div>
      <div className="flex-1">
        <h1 className='head-text'>Activity</h1>
        <section className='mt-10 flex flex-col gap-5'>
          {activity.length > 0 ? (
            <>
              {activity.map((activity) => (
                <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                  <article className='activity-card'>
                    <Image
                      src={activity.author.image}
                      alt='user_logo'
                      width={20}
                      height={20}
                      className='rounded-full object-cover'
                    />
                    <p className='!text-small-regular text-light-1'>
                      <span className='mr-1 text-primary-500'>
                        {activity.author.name}
                      </span>{" "}
                      replied to your post
                    </p>
                  </article>
                </Link>
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>No activity yet</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Page;
