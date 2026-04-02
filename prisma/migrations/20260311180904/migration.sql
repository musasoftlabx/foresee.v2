/*
  Warnings:

  - You are about to drop the column `storeId` on the `Clients` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `Clients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_storeId_fkey";

-- AlterTable
ALTER TABLE "Clients" DROP COLUMN "storeId",
ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
