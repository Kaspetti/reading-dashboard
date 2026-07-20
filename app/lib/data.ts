import { books, users } from "@/db/schema";
import "dotenv/config";
import { db } from "@/db/client";

export async function fetchUsers() {
  const result = await db.select().from(users);
  return result;
}

export async function fetchBooks() {
  const result = await db.select().from(books);
  return result;
}
