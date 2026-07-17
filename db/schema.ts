import { pgTable, timestamp, uuid, integer, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: text().notNull().unique(),
  displayName: text(),
  email: text().notNull().unique(),
  avatar: text(),
  passwordHash: text().notNull(),
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

export const booksTable = pgTable("books", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  author: text().notNull(),
  pages: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
