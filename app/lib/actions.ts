"use server";

import { drizzle } from "drizzle-orm/node-postgres";
import { createUserFormSchema } from "@/db/validators";
import z from "zod";
import { usersTable } from "@/db/schema";
import { revalidatePath } from "next/cache";

const db = drizzle(process.env.DATABASE_URL!);

export type State = {
  message: string | null;
  errors?: Record<string, string[]>;
};

export async function createUser(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const parsed = createUserFormSchema.safeParse({
    username: formData.get("username"),
    displayName: formData.get("display-name") || undefined,
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      message: "Validation failed.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await db.insert(usersTable).values({
      ...parsed.data,
      passwordHash: "",
    });
  } catch {
    return { message: "Database error: could not create user." };
  }

  revalidatePath("/");
  return { message: "User succesfully created.", errors: {} };
}
