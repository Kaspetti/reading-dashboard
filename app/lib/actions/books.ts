"use server";

import { db } from "@/db/client";
import { booksTable } from "@/db/schema";
import { createBookFormSchema } from "@/db/validators";
import { revalidatePath } from "next/cache";
import z from "zod";

export type BookState = {
  success?: string;
  error?: string;
  validationErrors?: Record<string, string[]>;
};

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
