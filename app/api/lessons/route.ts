import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { lessons } from "@/db/schema";

export const GET = async () => {
  //checking if the user is admin
  if(!isAdmin()) {
    return new NextResponse("Unauthorized",{status: 401});
  }

  //fetching all lessons
  const data = await db.query.lessons.findMany();
  
  return NextResponse.json(data);
}
export const POST = async (req: Request) => {
  //checking if the user is admin
  if(!isAdmin()) {
    return new NextResponse("Unauthorized",{status: 401});
  }

  const body = await req.json();

  //inserting a new unit
  const data = await db.insert(lessons).values({
    ...body,
  }).returning();
  
  return NextResponse.json(data[0]);
}