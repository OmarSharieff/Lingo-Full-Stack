import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { challenges } from "@/db/schema";

export const GET = async () => {
  //checking if the user is admin
  if(!isAdmin()) {
    return new NextResponse("Unauthorized",{status: 401});
  }

  //fetching all challenges
  const data = await db.query.challenges.findMany();
  
  return NextResponse.json(data);
}
export const POST = async (req: Request) => {
  //checking if the user is admin
  if(!isAdmin()) {
    return new NextResponse("Unauthorized",{status: 401});
  }

  const body = await req.json();

  //inserting a new challenge
  const data = await db.insert(challenges).values({
    ...body,
  }).returning();
  
  return NextResponse.json(data[0]);
}