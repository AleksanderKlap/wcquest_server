CREATE TYPE "public"."Paid" AS ENUM('FREE', 'PAID');--> statement-breakpoint
CREATE TABLE "Feature" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "Profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) DEFAULT 'WCQuest_User;)' NOT NULL,
	"bio" varchar(1000) DEFAULT 'I love this app!' NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "Profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "Toilet" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_by" integer NOT NULL,
	"paid" "Paid" DEFAULT 'FREE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ToiletToFeature" (
	"toilet_id" integer NOT NULL,
	"feature_id" integer NOT NULL,
	CONSTRAINT "ToiletToFeature_toilet_id_feature_id_pk" PRIMARY KEY("toilet_id","feature_id")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"googleId" varchar(255),
	"password" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Toilet" ADD CONSTRAINT "Toilet_created_by_User_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ToiletToFeature" ADD CONSTRAINT "ToiletToFeature_toilet_id_Toilet_id_fk" FOREIGN KEY ("toilet_id") REFERENCES "public"."Toilet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ToiletToFeature" ADD CONSTRAINT "ToiletToFeature_feature_id_Feature_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."Feature"("id") ON DELETE no action ON UPDATE no action;