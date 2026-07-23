import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { books, users } from "./schema";
import { z } from "zod";

export const insertUserSchema = createInsertSchema(users, {
  email: z.email("Must be a valid email."),
  username: z
    .string()
    .min(3, "Username must be between 3 and 15 characters.")
    .max(15, "Username must be between 3 and 15 characters."),
});
export const selectUserSchema = createSelectSchema(users);
export const updateUserSchema = createUpdateSchema(users);

export const createUserFormSchema = insertUserSchema
  .omit({
    avatar: true,
    passwordHash: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters long.")
      .max(72, "Password cannot be longer than 72 characters."),
  });

export const loginUserFormSchema = z.object({
  identifier: z.string().min(1, "Username or Email is required."),
  password: z.string().min(1, "Password is required."),
});

export const insertBookSchema = createInsertSchema(books, {
  title: z
    .string()
    .min(1, "Book title is required.")
    .max(200, "Book title must not exceed 200 characters."),
  author: z
    .string()
    .min(1, "Author is required.")
    .max(70, "Author must not exceed 70 characters."),
  pages: z.coerce
    .number({ error: "Pages must be a number." })
    .min(1, "Page count must be greater than 0."),
  isbn: z
    .string()
    .transform((val) => val.replaceAll("-", "").toUpperCase().trim())
    .refine((val) => val.length == 0 || /^(\d{13}|\d{9}[0-9X])$/.test(val), {
      error: "ISBN must follow ISBN-10 or ISBN-13 format.",
    }),
});
export const selectBookSchema = createSelectSchema(books);
export const updateBookSchema = createUpdateSchema(books);

export const createBookFormSchema = insertBookSchema.omit({
  createdAt: true,
  updatedAt: true,
});
