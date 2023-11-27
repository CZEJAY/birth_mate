import { NextResponse } from "next/server";


import User from "@/lib/models/user.model";
import useCurrentUser from "@/hooks/useCurrentUser";
import { connectToDB } from "@/lib/mongoose";

export async function POST(
  request: Request,
) {
  try {
    await connectToDB()
    const currentUser = await useCurrentUser();
    const body = await request.json();
    const {
      name,
      image,
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedUser = await User.findOneAndUpdate(
      {id: currentUser.id},
      {name, image},
      {upsert: true}
    )

    return NextResponse.json(updatedUser)
  } catch (error) {
    //console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}