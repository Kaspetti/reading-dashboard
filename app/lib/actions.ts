"use server";

import { createUserFormSchema, loginUserFormSchema } from "@/db/validators";
import z from "zod";
import { usersTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { clearSessionCookie, createSession } from "./session";
import { db } from "@/db/client";

export type State = {
  success?: string;
  error?: string;
  validationErrors?: Record<string, string[]>;
};

export type LoginState = {
  success?: string;
  error?: string;
  validationErrors?: Record<string, string[]>;
  identifier?: string;
};

export async function createUser(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const parsed = createUserFormSchema.safeParse({
    username: formData.get("username"),
    displayName: formData.get("display-name") || undefined,
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    console.log(parsed.error.issues);
    return {
      validationErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { password, ...userData } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await db.insert(usersTable).values({
      ...userData,
      passwordHash: passwordHash,
    });
  } catch {
    return { error: "Database error: could not create user." };
  }

  revalidatePath("/");
  redirect("/");
}

export async function loginUser(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginUserFormSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    console.error(parsed.error.issues);
    return {
      validationErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { identifier, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(
      or(eq(usersTable.username, identifier), eq(usersTable.email, identifier)),
    );

  const dummyHash =
    "$2a$12$BxA27TU60wtC3uEvPBNeiuh3NxkjpH8icbntLhhBpaehOX5zvPPW2";
  const result = await bcrypt.compare(
    password,
    user?.passwordHash ?? dummyHash,
  );
  if (!user || !result) {
    return { error: "Invalid username or password.", identifier: identifier };
  }

  const err = await createSession(user.id);
  if (err) {
    return { error: err };
  }

  revalidatePath("/");
  redirect("/");
}

export async function logoutUser() {
  await clearSessionCookie();

  revalidatePath("/login");
  redirect("/login");
}
