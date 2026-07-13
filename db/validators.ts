import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { usersTable } from "./schema";
import { z } from "zod";

export const insertUserSchema = createInsertSchema(usersTable, {
  email: z.email("Must be a valid email."),
  username: z
    .string()
    .min(3, "Username must be between 3 and 15 characters.")
    .max(15, "Username must be between 3 and 15 characters."),
});
export const selectUserSchema = createSelectSchema(usersTable);
export const updateUserSchema = createUpdateSchema(usersTable);

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
