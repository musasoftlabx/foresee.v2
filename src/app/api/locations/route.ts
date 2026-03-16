// * Server
import { NextRequest, NextResponse } from "next/server";

// * NPM
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
import padStart from "lodash/padStart";

// * Hooks
import { useDayjsDayFormatter } from "@/hooks/useDayjsDayFormatter";
import useQueryRefiner from "@/hooks/useQueryRefiner";

// * Libs
import { prisma } from "@/lib/prisma";

// * Types
import { Created, Modified } from "@/types";

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
    search: {
      table: "Locations",
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
      : await prisma.locations.findMany(query);

  const dataset = [];

  if (exportable) {
    return false;
  }

  for (const row of rows) {
    dataset.push({
      ...row,
      discrepancy: Math.abs(row.physicalCount - row.systemCount),
      created: {
        ...(row.created as unknown as Created),
        on: useDayjsDayFormatter((row.created as any).on),
      },
      modified: {
        ...(row.modified as unknown as Modified),
        on: useDayjsDayFormatter((row.modified as any).on),
      },
    });
  }

  return NextResponse.json({ count: dataset.length, dataset });
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
    const locationsCount = await prisma.locations.count({ where: { auditId } });

    // ? Create locations for the audit based on the created store
    const createdLocations = await prisma.locations.createMany({
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
      return NextResponse.json(
        await prisma.locations.update({
          where: { id },
          data: { [field]: value, modified: { by: username, on: new Date() } },
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
}

export async function DELETE(request: NextRequest) {
  const { ids } = await request.json();

  try {
    return NextResponse.json(
      await prisma.locations.deleteMany({ where: { id: { in: ids } } }),
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
