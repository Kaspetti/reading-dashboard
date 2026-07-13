import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).notNull().unique(),
  displayName: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  avatar: varchar({ length: 255 }),
  passwordHash: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const sessionsTable = pgTable("sessions", {
  sessionId: uuid().primaryKey(),
  userId: uuid().notNull(),
  expiresAt: timestamp().notNull(),
});
