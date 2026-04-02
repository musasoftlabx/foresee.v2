/*
  Warnings:

  - Added the required column `client` to the `Stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Stores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stores" ADD COLUMN     "client" VARCHAR(50) NOT NULL,
ADD COLUMN     "country" VARCHAR(100) NOT NULL;
