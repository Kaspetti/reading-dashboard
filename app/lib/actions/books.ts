"use server";

import { db } from "@/db/client";
import { books } from "@/db/schema";
import { createBookFormSchema } from "@/db/validators";
import { desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

export type BookState = {
  success?: string;
  error?: string;
  validationErrors?: Record<string, string[]>;
};

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
