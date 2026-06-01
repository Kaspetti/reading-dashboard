import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { usersTable } from "./schema";
import { z } from "zod";

export const insertUserSchema = createInsertSchema(usersTable, {
  email: z.email("Must be a valid email."),
  username: z.string().min(1).max(50),
});
export const selectUserSchema = createSelectSchema(usersTable);
export const updateUserSchema = createUpdateSchema(usersTable);

export const createUserFormSchema = insertUserSchema.omit({
  avatar: true,
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
});
