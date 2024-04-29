import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

//creating courses table
//serial() for auto-increment of id
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

//defining relation many-many for userProgress and courses.
export const coursesRelation = relations(courses, ({many})=> ({
  userProgress: many(userProgress),
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
