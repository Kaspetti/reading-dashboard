import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    ownedBooks: r.many.books({
      from: r.users.id.through(r.ownedBooks.userId),
      to: r.books.id.through(r.ownedBooks.bookId),
    }),
  },
  books: {
    owners: r.many.users(),
  },
}));
