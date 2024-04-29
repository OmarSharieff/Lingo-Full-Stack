import {neon} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";
import * as schema from "./schema"

const sql = neon(process.env.DATABASE_URL!);
//passing 'schema' as a second argument allows us to use the drizzle query API 
//for more into read docs https://orm.drizzle.team/docs/rqb
const db = drizzle(sql, {schema});
export default db;