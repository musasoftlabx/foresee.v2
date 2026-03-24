// * Server
import { type NextRequest, NextResponse } from "next/server";

// * NPM
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";

// * Hooks
import { dayjsDayFormatter } from "@/helpers/dayjsDayFormatter";
import useQueryRefiner from "@/hooks/useQueryRefiner";

// * Libs
import { prisma } from "@/lib/prisma";

// * Types
import type { Created, Modified } from "@/types";

// * Extensions
dayjs.extend(advancedFormat);

const username = "mmuliro";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { limit, offset, exportable, refines, store } = Object.fromEntries(
    searchParams.entries(),
  );

  const { query, searchResults } = await useQueryRefiner({
    where: { storeId: Number(store) },
    limit,
    offset,
    refines,
    search: {
      table: "Inventory",
      fields: ["barcode", "attributes", "added", "modified"],
    },
  });

  const rows =
    searchResults.length > 0
      ? searchResults
      : await prisma.inventory.findMany(query);

  const dataset = [];

  if (exportable) {
    return false;
  }

  for (const row of rows) {
    dataset.push({
      ...row.attributes,
      id: row.id,
      barcode: row.barcode,
      storeId: row.storeId,
      added: {
        ...(row.added as unknown as Created),
        on: dayjsDayFormatter((row.added as any).on),
      },
      modified: {
        ...(row.modified as unknown as Modified),
        on: dayjsDayFormatter(row.modified.on),
      },
    });
  }

  return NextResponse.json({ count: dataset.length, dataset });
}

export async function DELETE(request: NextRequest) {
  const { ids } = await request.json();

  try {
    return NextResponse.json(
      await prisma.inventory.deleteMany({ where: { id: { in: ids } } }),
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { icon: "", error: error.name, message: error.message },
        { status: 400 },
      );
    }
  }
}
