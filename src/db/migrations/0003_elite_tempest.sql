CREATE TYPE "public"."Client" AS ENUM('iOS', 'WEB', 'ANDROID');--> statement-breakpoint
CREATE TABLE "RefreshToken" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"refresh_token" varchar(512) NOT NULL,
	"client" "Client" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Toilet" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;