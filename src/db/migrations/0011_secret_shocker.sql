CREATE TABLE "ToiletRating" (
	"id" serial PRIMARY KEY NOT NULL,
	"toilet_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"rating_cleanliness" integer NOT NULL,
	"rating_accessibility" integer NOT NULL,
	"rating_location" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rating_cleanliness_boundry" CHECK ("ToiletRating"."rating_cleanliness" BETWEEN 1 AND 5),
	CONSTRAINT "rating_accessibility_boundry" CHECK ("ToiletRating"."rating_accessibility" BETWEEN 1 AND 5),
	CONSTRAINT "rating_location_boundry" CHECK ("ToiletRating"."rating_location" BETWEEN 1 AND 5)
);
--> statement-breakpoint
ALTER TABLE "ToiletRating" ADD CONSTRAINT "ToiletRating_toilet_id_Toilet_id_fk" FOREIGN KEY ("toilet_id") REFERENCES "public"."Toilet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ToiletRating" ADD CONSTRAINT "ToiletRating_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ToiletPhoto" ADD CONSTRAINT "ToiletPhoto_toilet_id_Toilet_id_fk" FOREIGN KEY ("toilet_id") REFERENCES "public"."Toilet"("id") ON DELETE no action ON UPDATE no action;