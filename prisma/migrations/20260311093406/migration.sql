/*
  Warnings:

  - You are about to drop the column `storeCode` on the `Audits` table. All the data in the column will be lost.
  - You are about to drop the column `storeCode` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `auditCode` on the `Locations` table. All the data in the column will be lost.
  - You are about to drop the column `auditCode` on the `Scans` table. All the data in the column will be lost.
  - You are about to drop the column `client` on the `Stores` table. All the data in the column will be lost.
  - Added the required column `storeId` to the `Audits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auditId` to the `Locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auditId` to the `Scans` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Audits" DROP CONSTRAINT "Audits_storeCode_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_storeCode_fkey";

-- DropForeignKey
ALTER TABLE "Locations" DROP CONSTRAINT "Locations_auditCode_fkey";

-- DropForeignKey
ALTER TABLE "Scans" DROP CONSTRAINT "Scans_auditCode_fkey";

-- DropIndex
DROP INDEX "Audits_code_key";

-- DropIndex
DROP INDEX "Inventory_barcode_key";

-- DropIndex
DROP INDEX "Locations_code_key";

-- DropIndex
DROP INDEX "Scans_barcode_key";

-- DropIndex
DROP INDEX "Scans_location_key";

-- AlterTable
ALTER TABLE "Audits" DROP COLUMN "storeCode",
ADD COLUMN     "storeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "storeCode",
ADD COLUMN     "storeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Locations" DROP COLUMN "auditCode",
ADD COLUMN     "auditId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Scans" DROP COLUMN "auditCode",
ADD COLUMN     "auditId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Stores" DROP COLUMN "client";

-- CreateTable
CREATE TABLE "Clients" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "added" JSONB NOT NULL,
    "modified" JSONB NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Audits_code_idx" ON "Audits"("code");

-- CreateIndex
CREATE INDEX "Locations_code_idx" ON "Locations"("code");

-- CreateIndex
CREATE INDEX "Scans_location_barcode_idx" ON "Scans"("location", "barcode");

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audits" ADD CONSTRAINT "Audits_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locations" ADD CONSTRAINT "Locations_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scans" ADD CONSTRAINT "Scans_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
