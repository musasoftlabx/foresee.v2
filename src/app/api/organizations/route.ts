// * Server
import { type NextRequest, NextResponse } from "next/server";

// * Schema
import { accountCollection } from "@/db/schema";

// * NPM
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";

// * Hooks
import { dayjsDayFormatter } from "@/helpers/dayjsDayFormatter";

// * Libs
import { prisma } from "@/lib/prisma";

// * Types
import type { Created, Modified } from "@/types";
import { Organizations } from "@/generated/prisma/client";

// * Extensions
dayjs.extend(advancedFormat);

const organizationId = 1;
const username = "mmuliro";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { limit, offset, operation, exportable, refines } = Object.fromEntries(
    searchParams.entries(),
  );

  const dataset = await prisma.organizations.findMany({
    where: { id: organizationId },
  });

  if (exportable) {
    return false;
  }

  try {
    return NextResponse.json({
      count: dataset.length,
      dataset: dataset.map((field: Organizations) => ({
        ...field,
        created: {
          ...(field.created as unknown as Created),
          on: dayjsDayFormatter((field.created as any).on),
        },
        modified: {
          ...(field.modified as unknown as Modified),
          on: dayjsDayFormatter((field.modified as any).on),
        },
      })),
    });
  } catch (error) {
    if (error instanceof Error)
      return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name } = await request.json();

  try {
    return NextResponse.json(
      await prisma.organizations.create({
        data: {
          name,
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
  const searchParams = request.nextUrl.searchParams;
  const { scope } = Object.fromEntries(searchParams.entries());

  if (scope === "editCell") {
    const { _id, field, value } = await request.json();
    try {
      return NextResponse.json(
        await accountCollection.findByIdAndUpdate(
          { _id },
          { [field]: value, modified: { by: "musa1", on: new Date() } },
        ),
        { status: 201 },
      );
    } catch (error) {
      if (error instanceof Error) {
        // logIt({code: 1, error: error.name, message: error.message})
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
  const { ids } = await request.json();

  try {
    return NextResponse.json(
      await prisma.organizations.deleteMany({ where: { id: { in: ids } } }),
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
