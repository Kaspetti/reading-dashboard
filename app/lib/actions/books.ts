"use server";

import { db } from "@/db/client";
import { works, userBookEntry } from "@/db/schema";
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

export type BooksSearch = Awaited<ReturnType<typeof searchBooks>>;
export type BookSearch = BooksSearch[number];
export type UserBookEntries = Awaited<ReturnType<typeof getUserBookEntries>>;
export type UserBookEntry = UserBookEntries[number];

export async function createBook(
  _prevState: BookState,
  formData: FormData,
): Promise<BookState> {
  const parsed = createBookFormSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author"),
    pages: formData.get("pages"),
    isbn: formData.get("isbn"),
  });

  if (!parsed.success) {
    console.log(parsed.error.issues);
    return {
      validationErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await db.insert(works).values({
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
      id: works.id,
      title: works.title,
    })
    .from(works)
    .where(
      and(
        works.verified,
        sql`${works.title} ILIKE ${"%" + query + "%"} OR ${works.title} <% ${query}`,
      ),
    )
    .orderBy(desc(sql`word_similarity(${query}, ${works.title})`))
    .limit(limit);
}

export async function getUserBookEntries() {
  const user = await getCurrentUser();
  if (!user) return [];

  const result = await db.query.userBookEntry.findMany({
    columns: {
      id: true,
      rawTitle: true,
      rawAuthor: true,
      rawPages: true,
      isbn: true,
    },
    with: {
      edition: {
        with: {
          work: true,
        },
      },
    },
    where: {
      userId: user.id,
      shelfStatus: "owned",
    },
  });

  return result;
}

export async function addOwnedBook(
  bookId: number,
  _prevState: BookState,
  _formData: FormData,
): Promise<BookState> {
  // const user = await getCurrentUser();
  // if (!user) {
  //   return { error: "Must be logged in to add owned book." };
  // }
  //
  // try {
  //   await db.insert(ownedBooks).values({
  //     userId: user.id,
  //     bookId: bookId,
  //   });
  // } catch {
  //   return { error: "Database error: could not add book to owned." };
  // }
  //
  // revalidatePath("/library");

  return { success: "Successfully added book to owned." };
}

export async function removeUserBookEntry(
  id: number,
  _prevState: BookState,
  _formData: FormData,
): Promise<BookState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Must be logged in to remove book entry." };
  }

  try {
    await db
      .delete(userBookEntry)
      .where(and(eq(userBookEntry.id, id), eq(userBookEntry.userId, user.id)));
  } catch {
    return {
      error: "Database error: could not remove book from user's book entries.",
    };
  }

  revalidatePath("/library");

  return { success: "Successfully removed book from user's book entries." };
}
