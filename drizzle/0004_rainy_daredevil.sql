ALTER TABLE "owned_books" DROP CONSTRAINT "owned_books_bookId_books_id_fk";
--> statement-breakpoint
ALTER TABLE "owned_books" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "owned_books" ALTER COLUMN "bookId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "owned_books" ADD CONSTRAINT "owned_books_bookId_books_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE restrict ON UPDATE no action;