CREATE TABLE "book_verification_attempts" (
	"bookId" integer PRIMARY KEY,
	"isbn" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"firstAttempt" timestamp DEFAULT now() NOT NULL,
	"latestAttempt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "book_verification_attempts" ADD CONSTRAINT "book_verification_attempts_bookId_books_id_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE;