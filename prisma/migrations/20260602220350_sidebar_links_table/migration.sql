-- CreateTable
CREATE TABLE "SidebarLinks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "route" VARCHAR(50) NOT NULL,
    "childOf" VARCHAR(50) NOT NULL,
    "isExpanded" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL,
    "added" JSONB NOT NULL,
    "modified" JSONB NOT NULL,

    CONSTRAINT "SidebarLinks_pkey" PRIMARY KEY ("id")
);
