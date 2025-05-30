CREATE TABLE "ToiletPhoto" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ToiletPhoto" ADD CONSTRAINT "ToiletPhoto_created_by_User_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;