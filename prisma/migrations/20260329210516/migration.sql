/*
  Warnings:

  - You are about to drop the column `activity` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "activity",
ADD COLUMN     "activities" JSONB[];
