// * Server
// biome-ignore assist/source/organizeImports: <biome-ignore lint: false positive>
import { type NextRequest, NextResponse } from "next/server";

// * NPM
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";

// * Helpers
import { dayjsDayFormatter } from "@/helpers/dayjsDayFormatter";

// * Libs
import { prisma } from "@/lib/prisma";
import { ByOn } from "@/types";

// * Extensions
dayjs.extend(advancedFormat);

const userId = 1;
const username = "mmuliro";
const model = "organizations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { nameOnly } = Object.fromEntries(searchParams.entries());

  if (nameOnly)
    return NextResponse.json(
      (
        await prisma[model].findMany({
          where: { userId },
          select: { id: true, name: true, isActive: true },
          orderBy: { id: "desc" },
        })
      ).map(({ id, name, isActive }) => ({ id, name, isActive })),
    );
  else {
    const rows = await prisma[model].findMany({
      where: { userId },
      orderBy: { id: "desc" },
    });

    const dataset = [];

    for (const row of rows) {
      dataset.push({
        ...row,
        details: [
          {
            label: "Stores",
            value: await prisma.stores.count({
              where: { organizationId: row.id },
            }),
          },
          {
            label: "Clients",
            value: await prisma.clients.count({
              where: { organizationId: row.id },
            }),
          },
          { label: "Team", value: 15 },
        ],
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

    return NextResponse.json(dataset);
  }
}

export async function POST(request: Request) {
  const { name, description } = await request.json();

  try {
    return NextResponse.json(
      await prisma[model].create({
        data: {
          userId,
          name,
          description,
          isActive:
            (await prisma[model].count({ where: { userId } })) === 0
              ? true
              : false,
          created: { by: username, on: new Date() },
          modified: { by: username, on: new Date() },
        },
      }),
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // ? Unique constraint failed
      if (error.code === "P2002") {
        return NextResponse.json(
          { icon: "", error: error.name, message: error.message },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { icon: "", error: error.name, message: error.message },
        { status: 500 },
      );
    }
  }
}

export async function PATCH(request: NextRequest) {
  const { id } = await request.json();

  try {
    await prisma[model].update({
      data: { isActive: true, modified: { by: username, on: new Date() } },
      where: { id },
    });

    await prisma[model].updateMany({
      data: { isActive: false },
      where: { AND: [{ id: { not: id }, userId }] },
    });

    return NextResponse.json({}, { status: 201 });
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
  const { id } = await request.json();

  try {
    return NextResponse.json(
      await prisma.organizations.delete({ where: { id } }),
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
