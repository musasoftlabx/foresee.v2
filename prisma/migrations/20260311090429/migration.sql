/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created" JSONB NOT NULL,
    "modified" JSONB NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(20) NOT NULL,
    "lastName" VARCHAR(20) NOT NULL,
    "emailAddress" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "avatar" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "roles" JSONB NOT NULL,
    "added" JSONB NOT NULL,
    "modified" JSONB NOT NULL,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stores" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "client" VARCHAR(50) NOT NULL,
    "created" JSONB NOT NULL,
    "modified" JSONB NOT NULL,

    CONSTRAINT "Stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "barcode" VARCHAR(30) NOT NULL,
    "attributes" JSONB NOT NULL,
    "added" JSONB NOT NULL,
    "modified" JSONB NOT NULL,
    "storeCode" TEXT NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audits" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "date" TIMESTAMP NOT NULL,
    "barcode" JSONB NOT NULL,
    "storeCode" TEXT NOT NULL,

    CONSTRAINT "Audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locations" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "physicalCount" INTEGER NOT NULL DEFAULT 0,
    "systemCount" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "created" JSONB NOT NULL,
    "modified" JSONB NOT NULL,
    "auditCode" TEXT NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scans" (
    "id" SERIAL NOT NULL,
    "location" VARCHAR(20) NOT NULL,
    "barcode" VARCHAR(30) NOT NULL,
    "scanned" JSONB NOT NULL,
    "auditCode" TEXT NOT NULL,

    CONSTRAINT "Scans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stores_code_key" ON "Stores"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_barcode_key" ON "Inventory"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Audits_code_key" ON "Audits"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Locations_code_key" ON "Locations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Scans_location_key" ON "Scans"("location");

-- CreateIndex
CREATE UNIQUE INDEX "Scans_barcode_key" ON "Scans"("barcode");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_storeCode_fkey" FOREIGN KEY ("storeCode") REFERENCES "Stores"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audits" ADD CONSTRAINT "Audits_storeCode_fkey" FOREIGN KEY ("storeCode") REFERENCES "Stores"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locations" ADD CONSTRAINT "Locations_auditCode_fkey" FOREIGN KEY ("auditCode") REFERENCES "Audits"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scans" ADD CONSTRAINT "Scans_auditCode_fkey" FOREIGN KEY ("auditCode") REFERENCES "Audits"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
