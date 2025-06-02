CREATE TABLE "ToiletComment" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_by" integer NOT NULL,
	"toilet_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"downvotes" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ToiletComment" ADD CONSTRAINT "ToiletComment_created_by_User_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ToiletComment" ADD CONSTRAINT "ToiletComment_toilet_id_Toilet_id_fk" FOREIGN KEY ("toilet_id") REFERENCES "public"."Toilet"("id") ON DELETE no action ON UPDATE no action;