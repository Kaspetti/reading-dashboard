import "dotenv/config";

import { db, pool } from "@/db/client";
import { books, bookVerificationAttempts } from "@/db/schema";
import { and, eq, isNotNull, not, sql } from "drizzle-orm";
import z from "zod";

const OPENLIBRARY_BASE_URL = "https://openlibrary.org/api/books";
const TIMEOUT_MS = 5000;
const BATCH_SIZE = 20;

const OpenLibraryBookSchema = z.object({
  title: z.string().optional(),
  authors: z.array(z.object({ name: z.string() })).optional(),
});

const OpenLibraryResponseSchema = z.record(z.string(), OpenLibraryBookSchema);

async function verifyBooks() {
  const unverifiedBooks = await db
    .select()
    .from(books)
    .where(and(isNotNull(books.isbn), not(books.verified)));

  if (unverifiedBooks.length == 0) {
    return;
  }

  for (let i = 0; i < unverifiedBooks.length; i += BATCH_SIZE) {
    await verifyBatch(unverifiedBooks.slice(i, i + BATCH_SIZE));
  }
}

async function verifyBatch(batch: (typeof books.$inferSelect)[]) {
  const url = new URL(OPENLIBRARY_BASE_URL);
  url.searchParams.set(
    "bibkeys",
    batch.map((book) => `ISBN:${book.isbn}`).join(","),
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

  for (const book of batch) {
    if (!book.isbn) continue;

    const match = data[`ISBN:${book.isbn}`];
    if (!match) {
      await db
        .insert(bookVerificationAttempts)
        .values({ bookId: book.id, isbn: book.isbn, attempts: 1 })
        .onConflictDoUpdate({
          target: bookVerificationAttempts.bookId,
          set: {
            attempts: sql`${bookVerificationAttempts.attempts} + 1`,
            latestAttempt: new Date(),
          },
        });

      continue;
    }

    await db.transaction(async (tx) => {
      await tx
        .update(books)
        .set({
          verified: true,
          title: match.title ?? "",
          author: match.authors?.[0]?.name ?? "",
        })
        .where(eq(books.id, book.id));

      await tx
        .delete(bookVerificationAttempts)
        .where(eq(bookVerificationAttempts.bookId, book.id));
    });
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
