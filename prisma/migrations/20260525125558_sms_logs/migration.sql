-- CreateTable
CREATE TABLE "SMSLogs" (
    "id" SERIAL NOT NULL,
    "receipients" JSONB[],
    "message" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SMSLogs_pkey" PRIMARY KEY ("id")
);
