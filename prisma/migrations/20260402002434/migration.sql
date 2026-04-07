/*
  Warnings:

  - You are about to drop the column `username` on the `Logins` table. All the data in the column will be lost.
  - Added the required column `emailAddress` to the `Logins` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Logins_username_idx";

-- AlterTable
ALTER TABLE "Logins" DROP COLUMN "username",
ADD COLUMN     "emailAddress" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE INDEX "Logins_emailAddress_idx" ON "Logins"("emailAddress");
