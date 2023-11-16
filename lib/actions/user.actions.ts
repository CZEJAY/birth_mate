"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User, { FriendRequest } from "../models/user.model";

import { connectToDB } from "../mongoose";
import { currentUser } from "@clerk/nextjs";


export async function fetchFriends(userId: string) {
  try {
    await connectToDB()
    const user = await currentUser()
    if (!user) throw new Error("You are not logged in")
    const authDbUser = await User.findOne({ id: userId }).populate({
      path: "friend_list",
      model: User,
      select: "username name image id",
  })
  return {
    authDbUser
  }
  } catch (error) {
    console.log(error)
  }
}

export async function fetchRequestList(userId: string) {
  try {
    connectToDB();

    console.log(userId)

    const user = await currentUser();
    if (!user) {
      throw new Error("You are not logged in");
    }

    const authDbUser = await User.findOne({ id: user.id });
    const friendDbUser = await User.findOne({ id: userId });

    if (!authDbUser || !friendDbUser) {
      throw new Error("User not found");
    }

    const friendRequestList = await User.findOne({id: userId}).populate({
      path: "friend_requests",
      model: FriendRequest,
      populate: {
        path: "sender",
        model: User,
        select: "username name image",
      },
      options: {
        sort: {
          createdAt: -1,
        }},
    })
    // console.log(friendRequestList.friend_requests)
    return {friendRequestList}
  } catch (error: any) {
    throw new Error(`Failed to fetch friend requests: ${error.message}`);
  }
}


export async function fetchRequests(userId: string) {
  try {
    connectToDB();

    const user = await currentUser();
    if (!user) {
      throw new Error("You are not logged in");
    }

    const authDbUser = await User.findOne({ id: user.id });
    const friendDbUser = await User.findOne({ id: userId });

    if (!authDbUser || !friendDbUser) {
      throw new Error("User not found");
    }

    const friendRequests = await FriendRequest.find({
      receiver: friendDbUser._id,
      sender: authDbUser._id,
      status: "pending",
    });

    // Extract status from each friend request in the array
    const friendRequestStatuses = friendRequests.map((request) => request.status);
    const friend_request = friendRequestStatuses[0];
    console.log(friend_request);

    return {
      friend_request,
      user,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch friend requests: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    const user = await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
      populate: {
        path: "friend_request",
        model: FriendRequest,
      },
    });
    return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}
