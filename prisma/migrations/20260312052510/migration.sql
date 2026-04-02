/*
  Warnings:

  - A unique constraint covering the columns `[template]` on the table `SpreadsheetTemplates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SpreadsheetTemplates_template_key" ON "SpreadsheetTemplates"("template");

-- CreateIndex
CREATE INDEX "SpreadsheetTemplates_template_idx" ON "SpreadsheetTemplates"("template");
