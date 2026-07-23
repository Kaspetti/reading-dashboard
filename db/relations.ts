import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    ownedBooks: r.many.works({
      from: r.users.id.through(r.ownedBooks.userId),
      to: r.works.id.through(r.ownedBooks.bookId),
    }),
  },
  editions: {
    work: r.one.works({
      from: r.editions.workId,
      to: r.works.id,
    }),
  },
  works: {
    owners: r.many.users(),
    editions: r.many.editions(),
  },
}));
