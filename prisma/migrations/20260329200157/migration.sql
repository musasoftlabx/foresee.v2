/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_organizationId_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "organizationId";
