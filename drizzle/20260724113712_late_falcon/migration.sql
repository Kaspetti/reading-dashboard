ALTER TABLE "editions" ADD COLUMN "olEditionId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "editions" DROP COLUMN "verified";--> statement-breakpoint
ALTER TABLE "editions" ALTER COLUMN "isbn" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "editions" ADD CONSTRAINT "editions_olEditionId_key" UNIQUE("olEditionId");