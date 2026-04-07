/*
  Warnings:

  - You are about to drop the column `usersId` on the `Logins` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logins" DROP CONSTRAINT "Logins_usersId_fkey";

-- AlterTable
ALTER TABLE "Logins" DROP COLUMN "usersId",
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Logins" ADD CONSTRAINT "Logins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
