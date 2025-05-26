ALTER TABLE "Toilet" ADD COLUMN "location" geometry(point) NOT NULL;--> statement-breakpoint
CREATE INDEX "spatial_index" ON "Toilet" USING gist ("location");