/*
  Warnings:

  - You are about to drop the `SMSLogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SMSLogs";

-- CreateTable
CREATE TABLE "smsLogs" (
    "id" SERIAL NOT NULL,
    "receipients" JSONB[],
    "message" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "smsLogs_pkey" PRIMARY KEY ("id")
);
