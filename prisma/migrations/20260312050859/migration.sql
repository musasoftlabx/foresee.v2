/*
  Warnings:

  - You are about to drop the column `entity` on the `SpreadsheetTemplates` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SpreadsheetTemplates` table. All the data in the column will be lost.
  - Added the required column `modified` to the `SpreadsheetTemplates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `template` to the `SpreadsheetTemplates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SpreadsheetTemplates" DROP COLUMN "entity",
DROP COLUMN "updatedAt",
ADD COLUMN     "modified" JSONB NOT NULL,
ADD COLUMN     "template" VARCHAR(20) NOT NULL;
