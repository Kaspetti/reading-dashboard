DROP TABLE "book_verification_attempts";--> statement-breakpoint
DROP TABLE "owned_books";--> statement-breakpoint
ALTER TABLE "works" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "works" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "works" DROP CONSTRAINT "books_isbn_key";--> statement-breakpoint
ALTER TABLE "works" ADD COLUMN "ol_work_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "works" DROP COLUMN "pages";--> statement-breakpoint
ALTER TABLE "works" DROP COLUMN "isbn";--> statement-breakpoint
ALTER TABLE "works" DROP COLUMN "verified";--> statement-breakpoint
ALTER TABLE "works" ADD CONSTRAINT "works_ol_work_id_key" UNIQUE("ol_work_id");