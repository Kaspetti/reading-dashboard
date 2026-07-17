import { booksTable, usersTable } from "@/db/schema";
import "dotenv/config";
import { db } from "@/db/client";

export async function fetchUsers() {
  const users = await db.select().from(usersTable);
  return users;
}

export async function fetchBooks() {
  const books = await db.select().from(booksTable);
  return books;
}
