-- CreateExtension
CREATE SCHEMA IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "postgis";

-- CreateEnum
CREATE TYPE "Paid" AS ENUM ('FREE', 'PAID');

-- CreateTable
CREATE TABLE "Toilet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_by" INTEGER NOT NULL,
    "paid" "Paid" NOT NULL DEFAULT 'FREE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Toilet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToiletFeature" (
    "toilet_id" INTEGER NOT NULL,
    "feature_id" INTEGER NOT NULL,

    CONSTRAINT "ToiletFeature_pkey" PRIMARY KEY ("toilet_id","feature_id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Toilet_created_by_key" ON "Toilet"("created_by");

-- AddForeignKey
ALTER TABLE "Toilet" ADD CONSTRAINT "Toilet_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToiletFeature" ADD CONSTRAINT "ToiletFeature_toilet_id_fkey" FOREIGN KEY ("toilet_id") REFERENCES "Toilet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToiletFeature" ADD CONSTRAINT "ToiletFeature_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
