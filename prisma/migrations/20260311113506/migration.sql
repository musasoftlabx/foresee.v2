/*
  Warnings:

  - The `activity` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stores" DROP CONSTRAINT "Stores_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_organizationId_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "activity",
ADD COLUMN     "activity" JSONB[];

-- DropTable
DROP TABLE "Organization";

-- CreateTable
CREATE TABLE "Organizations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created" JSONB NOT NULL,
    "modified" JSONB NOT NULL,

    CONSTRAINT "Organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organizations_name_key" ON "Organizations"("name");

-- CreateIndex
CREATE INDEX "Users_emailAddress_idx" ON "Users"("emailAddress");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stores" ADD CONSTRAINT "Stores_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
