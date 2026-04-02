-- DropIndex
DROP INDEX "Stores_code_key";

-- CreateTable
CREATE TABLE "ExcelImport" (
    "id" SERIAL NOT NULL,
    "entity" VARCHAR(20) NOT NULL,
    "fields" JSONB[],

    CONSTRAINT "ExcelImport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Clients_name_idx" ON "Clients"("name");

-- CreateIndex
CREATE INDEX "Inventory_barcode_idx" ON "Inventory"("barcode");

-- CreateIndex
CREATE INDEX "Stores_code_name_idx" ON "Stores"("code", "name");
