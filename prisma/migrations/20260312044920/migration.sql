/*
  Warnings:

  - You are about to drop the `ExcelImport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ExcelImport";

-- CreateTable
CREATE TABLE "SpreadsheetTemplates" (
    "id" SERIAL NOT NULL,
    "entity" VARCHAR(20) NOT NULL,
    "fields" JSONB[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpreadsheetTemplates_pkey" PRIMARY KEY ("id")
);
