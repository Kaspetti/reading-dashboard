import { usersTable } from "@/db/schema";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL!);

export async function fetchUsers() {
  const users = await db.select().from(usersTable);
  return users;
}
