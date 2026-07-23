import { works, users } from "@/db/schema";
import "dotenv/config";
import { db } from "@/db/client";

export async function fetchUsers() {
  const result = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
    })
    .from(users);
  return result;
}

export async function fetchBooks() {
  const result = await db.select().from(works);
  return result;
}
