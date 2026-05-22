// * Server
// biome-ignore assist/source/organizeImports: <biome-ignore lint: false positive>
import { type NextRequest, NextResponse } from "next/server";

// * NPM
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
import padStart from "lodash/padStart";

// * Hooks
import { dayjsDayFormatter } from "@/helpers/dayjsDayFormatter";
import QueryRefiner from "@/helpers/queryRefiner";

// * Libs
import { prisma } from "@/lib/prisma";

// * Types
import type { ByOn } from "@/types";

// * Extensions
dayjs.extend(advancedFormat);

const username = "mmuliro";
const model = "locations";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { limit, offset, exportable, refines, audit } = Object.fromEntries(
    searchParams.entries(),
  );

  const { query, searchResults, totalCount } = await QueryRefiner({
    where: { auditId: Number(audit) },
    limit,
    offset,
    refines,
    search: {
      model,
      fields: [
        "code",
        "barcode",
        "physicalCount",
        "systemCount",
        "isVerified",
        "created",
        "modified",
      ],
    },
  });

  const rows =
    searchResults.length > 0
      ? searchResults
      : await prisma[model].findMany(query);

  const dataset = [];

  if (exportable) {
    return false;
  }

  for (const row of rows) {
    dataset.push({
      ...row,
      discrepancy: Math.abs(row.physicalCount - row.systemCount),
      created: {
        ...row.created,
        on: dayjsDayFormatter(row.created.on),
      },
      modified: {
        ...row.modified,
        on: dayjsDayFormatter(row.modified.on),
      },
    });
  }

  return NextResponse.json({ dataset, filtered: dataset.length, totalCount });
}

export async function POST(request: Request) {
  const { store, audit, locations } = await request.json();

  const storeId = Number(store);
  const auditId = Number(audit);

  try {
    // ? Get store code for location code generation
    const { code: storeCode } = <{ code: string }>await prisma.stores.findFirst(
      {
        where: { id: storeId },
        select: { code: true },
      },
    );

    // ? Get date of audit for location code generation
    const { date } = <{ date: Date }>await prisma.audits.findFirst({
      where: { id: auditId },
      select: { date: true },
    });

    // ? Get number of locations under the audit
    const locationsCount = await prisma[model].count({ where: { auditId } });

    // ? Create locations for the audit based on the created store
    const createdLocations = await prisma[model].createMany({
      data: Array.from({ length: locations }).map((_, i) => ({
        auditId,
        code: `L${padStart((locationsCount + i + 1).toString(), 4, "0")}-${storeCode}-${dayjs(date).format("YYYYMMDD")}`,
        created: { by: username, on: new Date() },
        modified: { by: username, on: new Date() },
      })),
    });

    return NextResponse.json(createdLocations, { status: 201 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { icon: "", error: error.name, message: error.message },
        { status: 400 },
      );
    }
  }
}

export async function PATCH(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { scope } = Object.fromEntries(searchParams.entries());

  if (scope === "editCell") {
    const { id, field, value } = await request.json();
    try {
      const {
        modified: { by, on },
      } = (await prisma[model].update({
        where: { id },
        data: { [field]: value, modified: { by: username, on: new Date() } },
        select: { modified: true },
      })) as unknown as { modified: ByOn };

      return NextResponse.json(
        { by, on: dayjsDayFormatter(on) },
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
}

export async function DELETE(request: NextRequest) {
  const { ids } = await request.json();

  try {
    return NextResponse.json(
      await prisma[model].deleteMany({ where: { id: { in: ids } } }),
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
