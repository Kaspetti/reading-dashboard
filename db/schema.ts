import { sql } from "drizzle-orm";
import { uniqueIndex } from "drizzle-orm/cockroach-core";
import {
  pgTable,
  timestamp,
  uuid,
  integer,
  text,
  index,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const shelfStatusEnum = pgEnum("shelfStatus", [
  "owned",
  "wishlist",
  "want_to_read",
  "reading",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const sessions = pgTable("sessions", {
  sessionId: uuid("session_id").primaryKey(),
  userId: uuid("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const works = pgTable("works", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  olWorkId: text("ol_work_id").notNull().unique(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const editions = pgTable("editions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  olEditionId: text("ol_edition_id").notNull().unique(),
  workId: integer("work_id").references(() => works.id, {
    onDelete: "cascade",
  }),
  isbn: text("isbn").notNull().unique(),
  title: text("title").notNull(),
  pages: integer("pages").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userBookEntry = pgTable(
  "user_book_entry",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    editionId: integer("edition_id").references(() => editions.id, {
      onDelete: "set null",
    }),
    rawTitle: text("raw_title"),
    rawAuthor: text("raw_author"),
    rawPages: integer("raw_pages"),
    isbn: text("isbn"),
    shelfStatus: shelfStatusEnum("shelf_status").notNull().default("owned"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("user_edition_unique")
      .on(table.userId, table.editionId)
      .where(sql`${table.editionId} IS NOT NULL`),
    index("user_book_entry_isbn_idx").on(table.isbn),
  ],
);
