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
  const { limit, offset, exportable, refines, audit } = Object.fromEntries(
    searchParams.entries(),
  );

  const { query, searchResults } = await useQueryRefiner({
    where: { auditId: Number(audit) },
    limit,
    offset,
    refines,
    search: { table: "Scans", fields: ["location", "barcode", "scanned"] },
  });

  const rows =
    searchResults.length > 0
      ? searchResults
      : await prisma.scans.findMany(query);

  const dataset = [];

  if (exportable) {
    return false;
  }

  for (const row of rows) {
    dataset.push({
      ...row,
      scanned: {
        ...(row.scanned as unknown as Created),
        on: dayjsDayFormatter((row.scanned as any).on),
      },
    });
  }

  return NextResponse.json({ count: dataset.length, dataset });
}

export async function POST(request: Request) {
  const { audit: auditId, location, barcode, device } = await request.json();
  try {
    return NextResponse.json(
      await prisma.scans.create({
        data: {
          auditId,
          location,
          barcode,
          scanned: { by: username, on: new Date(), device },
        },
      }),
      { status: 201 },
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

export async function DELETE(request: NextRequest) {
  const { ids } = await request.json();

  try {
    return NextResponse.json(
      await prisma.scans.deleteMany({ where: { id: { in: ids } } }),
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
