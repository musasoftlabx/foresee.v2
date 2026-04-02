// * Server
import { type NextRequest, NextResponse } from "next/server";

// * NPM
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import advancedFormat from "dayjs/plugin/advancedFormat";
import capitalize from "lodash/capitalize";
import dayjs from "dayjs";

// * Hooks
import { dayjsDayFormatter } from "@/helpers/dayjsDayFormatter";
import useQueryRefiner from "@/hooks/useQueryRefiner";

// * Libs
import { prisma } from "@/lib/prisma";

// * Types
import type { ByOn } from "@/types";

// * Extensions
dayjs.extend(advancedFormat);

const organizationId = 1;
const username = "mmuliro";
const model = "clients";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { limit, offset, exportable, refines, nameOnly } = Object.fromEntries(
    searchParams.entries(),
  );

  if (nameOnly)
    return NextResponse.json(
      (
        await prisma[model].findMany({
          where: { organizationId },
          select: { name: true },
        })
      ).map(({ name }) => name),
    );
  else {
    const { query, searchResults, totalCount } = await useQueryRefiner({
      where: { organizationId },
      limit,
      offset,
      refines,
      search: { model, fields: ["name", "added", "modified"] },
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
        added: {
          ...(row.added as unknown as ByOn),
          on: dayjsDayFormatter(row.added.on),
        },
        modified: {
          ...(row.modified as unknown as ByOn),
          on: dayjsDayFormatter(row.modified.on),
        },
      });
    }

    return NextResponse.json({ dataset, filtered: dataset.length, totalCount });
  }
}

export async function POST(request: Request) {
  const { name } = await request.json();

  try {
    // ? Insert only if the incoming client doesn't exists. Else, ignore, don't update
    return NextResponse.json(
      await prisma[model].upsert({
        where: { id: 1, organizationId, name },
        update: {},
        create: {
          organizationId,
          name: capitalize(name),
          added: { by: username, on: new Date() },
          modified: { by: username, on: new Date() },
        },
      }),
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error) {
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
        await prisma[model].update({
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

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json(body, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const ids = await request.json();

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
