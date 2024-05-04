import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import db from "@/db/drizzle";
import { challenges, courses, units, userProgress } from "@/db/schema";

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
});

export const getUnits = cache(async()=> {
  const userProgress = await getUserProgress();

  if(!userProgress?.activeCourseId) {
    return [];
  }

  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId), // denotes which units to load
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: true
            }
          }
        }
      }
    }
  });
  const normalizedData = data.map((unit)=> {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson)=> {
      const allCompletedChallenges = lesson.challenges.every((challenge)=>{
        return challenge.challengeProgress
          && challenge.challengeProgress.length > 0
          && challenge.challengeProgress.every((progress)=> progress.completed);
      });
      return {...lesson, completed: allCompletedChallenges}
    });
    return {...unit, lessons: lessonsWithCompletedStatus}
  });
  return normalizedData;
});


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