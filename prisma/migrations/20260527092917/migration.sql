/*
  Warnings:

  - You are about to drop the column `isVerified` on the `Members` table. All the data in the column will be lost.
  - You are about to drop the column `membersId` on the `Organizations` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `Members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Organizations" DROP CONSTRAINT "Organizations_membersId_fkey";

-- AlterTable
ALTER TABLE "Members" DROP COLUMN "isVerified",
ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Organizations" DROP COLUMN "membersId";

-- AddForeignKey
ALTER TABLE "Members" ADD CONSTRAINT "Members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
