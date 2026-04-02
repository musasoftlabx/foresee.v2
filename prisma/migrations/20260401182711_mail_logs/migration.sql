/*
  Warnings:

  - The `roles` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[emailAddress]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "username" VARCHAR(20),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(100),
DROP COLUMN "roles",
ADD COLUMN     "roles" JSONB[];

-- CreateTable
CREATE TABLE "Logins" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "device" JSONB NOT NULL,
    "client" JSONB NOT NULL,
    "os" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" INTEGER,

    CONSTRAINT "Logins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailLogs" (
    "id" SERIAL NOT NULL,
    "receipients" JSONB[],
    "subject" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MailLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Logins_username_idx" ON "Logins"("username");

-- CreateIndex
CREATE INDEX "MailLogs_receipients_idx" ON "MailLogs"("receipients");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_emailAddress_key" ON "Users"("emailAddress");

-- AddForeignKey
ALTER TABLE "Logins" ADD CONSTRAINT "Logins_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
