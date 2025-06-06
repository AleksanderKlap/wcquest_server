import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schemas/schema";

const db = drizzle(process.env.DATABASE_URL!, { schema, logger: true });

export default db;
