CREATE TYPE "shelfStatus" AS ENUM('owned', 'wishlist', 'want_to_read', 'reading');--> statement-breakpoint
CREATE TABLE "user_book_entry" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_book_entry_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" uuid NOT NULL,
	"editionId" integer,
	"rawTitle" text,
	"rawAuthor" text,
	"rawPages" integer,
	"isbn" text,
	"shelfStatus" "shelfStatus" DEFAULT 'owned'::"shelfStatus" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "user_book_entry_isbn_idx" ON "user_book_entry" ("isbn");--> statement-breakpoint
ALTER TABLE "user_book_entry" ADD CONSTRAINT "user_book_entry_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_book_entry" ADD CONSTRAINT "user_book_entry_editionId_editions_id_fkey" FOREIGN KEY ("editionId") REFERENCES "editions"("id") ON DELETE SET NULL;