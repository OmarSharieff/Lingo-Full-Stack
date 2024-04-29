//creating courses table

import { pgTable, serial, text } from "drizzle-orm/pg-core";

//serial() for auto-increment of id
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});
