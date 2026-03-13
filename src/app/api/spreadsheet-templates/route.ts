// * Server
import { NextRequest, NextResponse } from "next/server";

// * NPM
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";

// * Libs
import { prisma } from "@/lib/prisma";

// * Extensions
dayjs.extend(advancedFormat);

const username = "mmuliro";

export async function GET(request: NextRequest) {
  //const { template } = await request.json();
  const template = "inventory";

  return NextResponse.json(
    (
      await prisma.spreadsheetTemplates.findFirst({
        where: { template },
        select: { fields: true },
      })
    )?.fields,
  );
  return NextResponse.json(await prisma.spreadsheetTemplates.findMany({}));
}

export async function POST(request: Request) {
  const { template, fields } = await request.json();

  try {
    return NextResponse.json(
      await prisma.spreadsheetTemplates.create({
        data: { template, fields, modified: { by: username, on: new Date() } },
      }),
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // ? Unique constraint failed
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            icon: "",
            error: "Conflict!",
            message: `A template with the name ${template} already exists.`,
          },
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
}

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json(body, { status: 201 });
}

export async function DELETE(request: Request) {
  const {} = request.json();
  return NextResponse.json({ user: 1 }, { status: 204 });
}
