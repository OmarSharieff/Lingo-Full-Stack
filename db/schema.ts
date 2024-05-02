import { RelationTableAliasProxyHandler, relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

//creating courses table
//serial() for auto-increment of id
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

//defining relation many-many for userProgress and courses.
//also added many relationship with units, which means courses can have many units.
export const coursesRelations = relations(courses, ({many})=> ({
  userProgress: many(userProgress),
  units: many(units),
}));

// creating a table for units
export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // unit 1
  description: text("description").notNull(), // Learn the basics of Spanish
  // to know for which course is this unit for
  courseId: integer("course_id").references(()=> courses.id, {onDelete: "cascade"}).notNull(),
  order: integer("order").notNull(), 
});

// creating a relation with units
// we need both many and one
// each unit can have only one course relation.
// each unit can have many lessons
export const unitsRelations = relations(units, ({many, one})=> ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

// writing the lessons
export const lessons = pgTable("lessons",{
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id").references(()=>units.id,{onDelete: "cascade"}).notNull(),
  order: integer("order").notNull(),
});

// Each lesson has only one unit
export const lessonsRelations = relations(lessons,({one,many})=>({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id]
  }),
  challenges: many(challenges),
}));

//Creating type of a challenge using enums
// SELECT eg: Which of these is an apple? (asking directly and user selects proper answer)
// ASSIST Here the question is simply gonna say "apple" and the user has to select a translation
export const challengesEnum = pgEnum("type",["SELECT", "ASSIST"]);

//Each lesson is going to have a challenge
export const challenges = pgTable("challenges",{
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").references(()=> lessons.id, {onDelete: "cascade"}).notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  //for storing challenges by hardest or by any other arbitrary value.
  //order gives control which challenge will appear first in a given lesson
  order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges,({one,many})=>({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  //Each challenge can have a lot of challenge options
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options",{
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").references(()=> challenges.id, {onDelete: "cascade"}).notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"), //optional
});

//each individual challenge option can have only one challenge
export const challengeOptionsRelations = relations(challengeOptions,({one})=>({
  challenge: one(challenges, {
    fields: [challengeOptions.challengeId],
    references: [challenges.id],
  }),
}));


export const challengeProgress = pgTable("challenge_progress",{
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id").references(()=> challenges.id, {onDelete: "cascade"}).notNull(),
  //to track which challenge user has completed, and then we're gonna use challengeProgress to later calculate the percentage of lesson completion
  completed: boolean("completed").notNull().default(false),
});

//each individual challenge option can have only one challenge
export const challengeProgressRelations = relations(challengeProgress,({one})=>({
  challenge: one(challenges, {
    fields: [challengeProgress.challengeId],
    references: [challenges.id],
  }),
}));

//creating another table for which course the user is currently taking
export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default('/mascot.svg'),
  activeCourseId: integer("active_course_id").references(()=> courses.id, {onDelete: "cascade"}),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),
});

//defining one-many relation for userProgress and activeCourse
export const userProgressRelations = relations(userProgress, ({one})=> ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));
