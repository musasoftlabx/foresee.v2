/*
  Warnings:

  - Made the column `phoneNumber` on table `Members` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `Members` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Members" ALTER COLUMN "phoneNumber" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
