import { cache } from "react";
import db from "@/db/drizzle";

//queries that fetch new added courses from database
export const getCourses = cache(async()=> {
  const data = await db.query.courses.findMany();
  return data;
})