// Creating a method that will be able to mark a challenge as completed or not

"use server";

import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const upsertChallengeProgress = async(challengeId: number)=> {
  const {userId} = await auth();
  
  if(!userId) {
    throw new Error("Unauthorized");
  }

  const currentUserProgress = await getUserProgress();
  const userSubscription = await getUserSubscription();

  //TODO: Handle Subscription query later

  if(!currentUserProgress) {
    throw new Error("User progress not found");
  }

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId)
  })

  if(!challenge) {
    throw new Error("Challenge not found");
  }

  const lessonId = challenge.lessonId;

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    // and() is used to combine multiple filters, so we use two eq() inside
    where: and(
      eq(challengeProgress.userId,userId),
      eq(challengeProgress.challengeId,challengeId)
    ),
  });
  //using the existingChallengeProgress we can knnow whether the current viewership of this challenge is a practice or not.
  //so if this is user's first time creating an upsert and creating this model 'challengeProgress' it means that they are in a active lesson
  //but if this challengeProgress already exists that means user is practicing again on this challenge.
  //so we can derive that...
  const isPractice = !!existingChallengeProgress; // getting the boolean value of existingChallengeProgress
  
  //preventing the user from practicing if they have no hearts left
  
  if(currentUserProgress.hearts === 0 && !isPractice && !userSubscription?.isActive) {
    return {error: "hearts"};
  } 

  //Hanndles update of the challengeProgress for the practice
  if(isPractice) {
    await db.update(challengeProgress).set({
      completed: true,
    })
    .where(
      eq(challengeProgress.id,existingChallengeProgress.id)
    );

    //Handle the update of userProgress
    //as the user practices, the hearts increase
    //but if user already has 5 hearts we don't want the user to have 6 hearts
    await db.update(userProgress).set({
      //Math.min() tells us the lower of two values
      hearts: Math.min(currentUserProgress.hearts + 1, 5),
      //no limits for points
      points: currentUserProgress.points + 10,
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
    return;
  }
  await db.insert(challengeProgress).values({
    challengeId,
    userId,
    completed: true,
  });

  await db.update(userProgress).set({
    points: currentUserProgress.points + 10,
  }).where(eq(userProgress.userId,userId));
  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
  
}
