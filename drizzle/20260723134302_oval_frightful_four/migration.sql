ALTER TABLE "editions" ADD COLUMN "workId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "editions" ADD COLUMN "isbn" text;--> statement-breakpoint
ALTER TABLE "editions" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "editions" ADD COLUMN "pages" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "editions" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "editions" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "works" ALTER COLUMN "verified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "editions" ADD CONSTRAINT "editions_isbn_key" UNIQUE("isbn");--> statement-breakpoint
ALTER TABLE "editions" ADD CONSTRAINT "editions_workId_works_id_fkey" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE CASCADE;