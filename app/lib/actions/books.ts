"use server";

import { db } from "@/db/client";
import { booksTable } from "@/db/schema";
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
    await db.insert(booksTable).values({
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
      id: booksTable.id,
      title: booksTable.title,
      author: booksTable.author,
      similarity: sql<number>`word_similarity(${query}, ${booksTable.title})`,
    })
    .from(booksTable)
    .where(
      sql`${booksTable.title} ILIKE ${"%" + query + "%"} OR ${booksTable.title} <% ${query}`,
    )
    .orderBy(desc(sql`word_similarity(${query}, ${booksTable.title})`))
    .limit(limit);
}
