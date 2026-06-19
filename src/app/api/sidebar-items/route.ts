// * Server
// biome-ignore assist/source/organizeImports: <biome-ignore lint: false positive>
import { type NextRequest, NextResponse } from "next/server";

// * NPM
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";

// * Hooks
import { dayjsDayFormatter } from "@/helpers/dayjsDayFormatter";
import QueryRefiner from "@/helpers/queryRefiner";

// * Libs
import { prisma } from "@/lib/prisma";

// * Extensions
dayjs.extend(advancedFormat);

const username = "mmuliro";
const model = "sidebarLinks";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { limit, offset, exportable, refines } = Object.fromEntries(
    searchParams.entries(),
  );

  const { nameOnly } = Object.fromEntries(searchParams.entries());

  if (nameOnly)
    return NextResponse.json(
      (
        await prisma[model].findMany({
          where: { isVisible: true },
          select: { name: true },
          orderBy: { id: "asc" },
        })
      ).map(({ name }) => name),
    );
  else {
    const { query, searchResults } = await QueryRefiner({
      where: {},
      limit,
      offset,
      refines,
      search: { model, fields: ["name", "route", "added"] },
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
          ...row.added,
          on: dayjsDayFormatter(row.added.on),
        },
      });
    }

    return NextResponse.json({ count: dataset.length, dataset });
  }
}

export async function POST(request: Request) {
  const { name, route, isGroup, childOf } = await request.json();
  try {
    return NextResponse.json(
      await prisma[model].create({
        data: {
          name,
          route: isGroup ? null : `/${route}`,
          childOf,
          added: { by: username, on: new Date() },
          modified: { by: username, on: new Date() },
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

export async function PUT(request: NextRequest) {
  const body = await request.json();

  for (const [i, row] of body.entries()) {
    await prisma[model].updateManyAndReturn({
      where: { id: row.id },
      data: {
        priority: i + 1,
        modified: { by: username, on: new Date() },
      },
    });
  }

  return new NextResponse("Updated!");
}

export async function PATCH(request: NextRequest) {
  const { id, field, value } = await request.json();

  return NextResponse.json(
    await prisma[model].updateManyAndReturn({
      where: { id },
      data: { [field]: value, modified: { by: username, on: new Date() } },
    }),
    { status: 201 },
  );
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
