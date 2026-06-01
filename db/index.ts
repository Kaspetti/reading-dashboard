import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "./schema";
// import { eq } from "drizzle-orm";
//
const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const users: (typeof usersTable.$inferInsert)[] = [
    {
      username: "testpeti",
      email: "testpeti@testread.com",
      passwordHash: "",
      displayName: "Testpeti",
    },
    {
      username: "ada_lovelace",
      email: "ada@example.com",
      passwordHash: "",
      displayName: "Ada Lovelace",
    },
    {
      username: "grace_h",
      email: "grace.hopper@example.com",
      passwordHash: "",
      displayName: "Grace Hopper",
    },
    {
      username: "alan_t",
      email: "alan.turing@example.com",
      passwordHash: "",
      displayName: "Alan Turing",
    },
    {
      username: "katherine_j",
      email: "katherine.johnson@example.com",
      passwordHash: "",
      displayName: "Katherine Johnson",
    },
    {
      username: "linus_t",
      email: "linus@example.com",
      passwordHash: "",
      displayName: "Linus Torvalds",
    },
    {
      username: "margaret_h",
      email: "margaret.hamilton@example.com",
      passwordHash: "",
      displayName: "Margaret Hamilton",
    },
    {
      username: "dennis_r",
      email: "dennis.ritchie@example.com",
      passwordHash: "",
      displayName: "Dennis Ritchie",
    },
  ];

  await db.insert(usersTable).values(users);
  console.log(`${users.length} test users created!`);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
