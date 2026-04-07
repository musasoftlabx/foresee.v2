/*
  Warnings:

  - You are about to drop the column `os` on the `Logins` table. All the data in the column will be lost.
  - Added the required column `ip` to the `Logins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Logins" DROP COLUMN "os",
ADD COLUMN     "ip" VARCHAR(20) NOT NULL;
