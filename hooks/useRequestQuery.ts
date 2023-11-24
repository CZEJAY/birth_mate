import qs from "query-string";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchRequestList } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";


interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

export const useFriendRequestQuery = async () => {
    const user = await currentUser()
    const {
      fetchNextPage,
      fetchPreviousPage,
      hasNextPage,
      hasPreviousPage,
      isFetchingNextPage,
      isFetchingPreviousPage,
      ...result
    } = useInfiniteQuery({
      queryKey: ["friendRequest"],
      //@ts-expect-error
      queryFn: ({ pageParam = 1 }) => fetchRequestList(user?.id),
      //@ts-expect-error
      ...options,
      //@ts-expect-error
      getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
      //@ts-expect-error
      getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
    })
    return {
      ...result,
      fetchNextPage,
      fetchPreviousPage,
      hasNextPage,
      hasPreviousPage,
      isFetchingNextPage,
      isFetchingPreviousPage,
      //@ts-expect-error
      data: result.data?.pages.map((page) => page.data).flat(),
    }
}