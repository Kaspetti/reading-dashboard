CREATE TABLE "owned_books" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "owned_books_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" text NOT NULL,
	"bookId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "owned_books_userId_bookId_unique" UNIQUE("userId","bookId")
);
--> statement-breakpoint
ALTER TABLE "owned_books" ADD CONSTRAINT "owned_books_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "owned_books" ADD CONSTRAINT "owned_books_bookId_books_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "owned_books_userId_index" ON "owned_books" USING btree ("userId");