/*
  Warnings:

  - Added the required column `location` to the `Toilet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Toilet" ADD COLUMN     "location" postgis.geography(Point, 4326) NOT NULL;

-- CreateIndex
CREATE INDEX "toilet_geo_index" ON "Toilet" USING GIST ("location");
