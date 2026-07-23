import {
  pgTable,
  timestamp,
  uuid,
  integer,
  text,
  unique,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
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

export const sessions = pgTable("sessions", {
  sessionId: uuid().primaryKey(),
  userId: uuid().notNull(),
  expiresAt: timestamp().notNull(),
});

export const books = pgTable("books", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  author: text().notNull(),
  pages: integer().notNull(),
  isbn: text().unique(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const ownedBooks = pgTable(
  "owned_books",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookId: integer()
      .notNull()
      .references(() => books.id, { onDelete: "restrict" }),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [
    unique().on(table.userId, table.bookId),
    index().on(table.userId),
  ],
);
