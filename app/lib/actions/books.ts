"use server";

import { db } from "@/db/client";
import { books, ownedBooks } from "@/db/schema";
import { createBookFormSchema } from "@/db/validators";
import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getCurrentUser } from "../session";

export type BookState = {
  success?: string;
  error?: string;
  validationErrors?: Record<string, string[]>;
};

export type Book = typeof books.$inferSelect;
export type Books = Awaited<ReturnType<typeof searchBooks>>;

export async function createBook(
  _prevState: BookState,
  formData: FormData,
): Promise<BookState> {
  const parsed = createBookFormSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author"),
    pages: formData.get("pages"),
  });

  if (!parsed.success) {
    console.log(parsed.error.issues);
    return {
      validationErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await db.insert(books).values({
      ...parsed.data,
    });
  } catch {
    return { error: "Database error: could not create book." };
  }

  revalidatePath("/library");

  return { success: "Successfully created book." };
}

export async function searchBooks(query: string, limit = 10) {
  if (!query.trim()) return [];

  return db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
    })
    .from(books)
    .where(
      sql`${books.title} ILIKE ${"%" + query + "%"} OR ${books.title} <% ${query}`,
    )
    .orderBy(desc(sql`word_similarity(${query}, ${books.title})`))
    .limit(limit);
}

export async function getOwnedBooks() {
  const user = await getCurrentUser();
  if (!user) return [];

  const result = await db.query.books.findMany({
    where: {
      owners: {
        id: user.id,
      },
    },
  });

  return result;
}

export async function addOwnedBook(
  bookId: number,
  _prevState: BookState,
  _formData: FormData,
): Promise<BookState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Must be logged in to add owned book." };
  }

  try {
    await db.insert(ownedBooks).values({
      userId: user.id,
      bookId: bookId,
    });
  } catch {
    return { error: "Database error: could not add book to owned." };
  }

  revalidatePath("/library");

  return { success: "Successfully added book to owned." };
}

export async function removeOwnedBook(
  bookId: number,
  _prevState: BookState,
  _formData: FormData,
): Promise<BookState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Must be logged in to remove owned book." };
  }

  try {
    await db
      .delete(ownedBooks)
      .where(
        and(eq(ownedBooks.bookId, bookId), eq(ownedBooks.userId, user.id)),
      );
  } catch {
    return { error: "Database error: coould not remove book from owned." };
  }

  revalidatePath("/library");

  return { success: "Successfully removed book from owned." };
}
