import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import db from "@/db/drizzle";
import { courses, userProgress } from "@/db/schema";

export const getUserProgress = cache(async()=> {
  const {userId} = await auth();

  //if we dont have userid we cannot load
  if(!userId) {
    return null;
  }
  //otherwise
  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      //populating active course relation
      activeCourse: true, 
    },
  });
  return data;
})

//queries that fetch new added courses from database
export const getCourses = cache(async()=> {
  const data = await db.query.courses.findMany();
  return data;
})

//create a new userProgress inside the database when user clicks on any one of the course
export const getCourseById = cache(async(courseId: number)=> {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    //TODO: Populate units and lessons
  });
  return data;
}) 