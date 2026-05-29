-- AlterTable
ALTER TABLE "Logins" ADD COLUMN     "memberId" INTEGER;

-- AlterTable
ALTER TABLE "Organizations" ADD COLUMN     "membersId" INTEGER;

-- CreateTable
CREATE TABLE "Members" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(20) NOT NULL,
    "lastName" VARCHAR(20) NOT NULL,
    "emailAddress" VARCHAR(50) NOT NULL,
    "phoneNumber" VARCHAR(20),
    "password" VARCHAR(100),
    "passcode" INTEGER,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "added" JSONB NOT NULL,
    "modified" JSONB NOT NULL,
    "roles" JSONB[],
    "activities" JSONB[],

    CONSTRAINT "Members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Members_emailAddress_key" ON "Members"("emailAddress");

-- CreateIndex
CREATE INDEX "Members_emailAddress_idx" ON "Members"("emailAddress");

-- AddForeignKey
ALTER TABLE "Organizations" ADD CONSTRAINT "Organizations_membersId_fkey" FOREIGN KEY ("membersId") REFERENCES "Members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logins" ADD CONSTRAINT "Logins_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
