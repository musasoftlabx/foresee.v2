/*
  Warnings:

  - You are about to drop the column `emailAddress` on the `Logins` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Logins_emailAddress_idx";

-- DropIndex
DROP INDEX "Users_username_key";

-- AlterTable
ALTER TABLE "Logins" DROP COLUMN "emailAddress";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "username";
