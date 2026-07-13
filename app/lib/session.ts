import "server-only";
import { cookies } from "next/headers";
import { db } from "@/db/client";
import { sessionsTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

export type SessionUser = Awaited<ReturnType<typeof getCurrentUser>>;

export async function createSession(userId: string): Promise<string | null> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionId = crypto.randomUUID();
  const cookieStore = await cookies();

  try {
    await db.insert(sessionsTable).values({
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

export async function getCurrentUser() {
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
    .from(sessionsTable)
    .where(eq(sessionsTable.sessionId, parsed.data));

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await db
        .delete(sessionsTable)
        .where(eq(sessionsTable.sessionId, session.sessionId));
    }
    return null;
  }

  const [user] = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      displayName: usersTable.displayName,
      avatar: usersTable.avatar,
    })
    .from(usersTable)
    .where(eq(usersTable.id, session.userId));

  return user ?? null;
}

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

  await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.sessionId, parsed.data));

  cookieStore.delete("session");
}
