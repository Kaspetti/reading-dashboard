import "server-only";
import { cookies } from "next/headers";
import { db } from "@/db/client";
import { sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";
import { cache } from "react";

export type SessionUser = Awaited<ReturnType<typeof getCurrentUser>>;

export async function createSession(userId: string): Promise<string | null> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionId = crypto.randomUUID();
  const cookieStore = await cookies();

  try {
    await db.insert(sessions).values({
      sessionId: sessionId,
      userId: userId,
      expiresAt: expiresAt,
    });
  } catch {
    return "Database error: could not create session.";
  }

  cookieStore.set("session", sessionId, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return null;
}

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return null;
  }

  const parsed = z.uuid().safeParse(sessionCookie.value);
  if (!parsed.success) {
    return null;
  }

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.sessionId, parsed.data));

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await db
        .delete(sessions)
        .where(eq(sessions.sessionId, session.sessionId));
    }
    return null;
  }

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatar: users.avatar,
    })
    .from(users)
    .where(eq(users.id, session.userId));

  return user ?? null;
});

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return null;
  }

  const parsed = z.uuid().safeParse(sessionCookie.value);
  if (!parsed.success) {
    return null;
  }

  await db.delete(sessions).where(eq(sessions.sessionId, parsed.data));

  cookieStore.delete("session");
}
