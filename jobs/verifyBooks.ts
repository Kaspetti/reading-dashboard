import "dotenv/config";

import { db, pool } from "@/db/client";
import { books } from "@/db/schema";
import { and, eq, isNotNull, not } from "drizzle-orm";
import z from "zod";

const OPENLIBRARY_BASE_URL = "https://openlibrary.org/api/books";
const TIMEOUT_MS = 5000;

const OpenLibraryBookSchema = z.object({
  title: z.string().optional(),
  authors: z.array(z.object({ name: z.string() })).optional(),
});

const OpenLibraryResponseSchema = z.record(z.string(), OpenLibraryBookSchema);

export async function verifyBooks() {
  const unverifiedBooks = await db
    .select()
    .from(books)
    .where(and(isNotNull(books.isbn), not(books.verified)));

  if (unverifiedBooks.length == 0) {
    return;
  }

  const url = new URL(OPENLIBRARY_BASE_URL);
  url.searchParams.set(
    "bibkeys",
    unverifiedBooks.map((book) => `ISBN:${book.isbn}`).join(","),
  );
  url.searchParams.set("format", "json");
  url.searchParams.set("jscmd", "data");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let data: z.infer<typeof OpenLibraryResponseSchema>;
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { "User-Agent": "reading-dashboard (kasparm@tutamail.com)" },
    });
    if (!res.ok) throw new Error(`Open Library returned ${res.status}`);
    data = OpenLibraryResponseSchema.parse(await res.json());
  } finally {
    clearTimeout(timer);
  }

  for (const book of unverifiedBooks) {
    const match = data[`ISBN:${book.isbn}`];
    if (!match) continue;

    await db
      .update(books)
      .set({
        verified: true,
        title: match.title ?? "",
        author: match.authors?.[0]?.name ?? "",
      })
      .where(eq(books.id, book.id));
  }
}

async function main() {
  await verifyBooks();
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
