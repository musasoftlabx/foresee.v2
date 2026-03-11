/*
  Warnings:

  - Added the required column `activity` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "activity" JSONB NOT NULL;
