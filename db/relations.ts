import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    bookEntries: r.many.userBookEntry({
      from: r.users.id,
      to: r.userBookEntry.userId,
    }),
  },
  editions: {
    work: r.one.works({
      from: r.editions.workId,
      to: r.works.id,
    }),
    bookEntries: r.many.userBookEntry(),
  },
  works: {
    editions: r.many.editions(),
  },
  userBookEntry: {
    user: r.one.users(),
    edition: r.one.editions({
      from: r.userBookEntry.editionId,
      to: r.editions.id,
    }),
  },
}));
