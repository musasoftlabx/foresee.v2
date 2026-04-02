/*
  Warnings:

  - Added the required column `created` to the `Audits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modified` to the `Audits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Audits" ADD COLUMN     "created" JSONB NOT NULL,
ADD COLUMN     "modified" JSONB NOT NULL;
