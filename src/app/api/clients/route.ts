// * Server
import { type NextRequest, NextResponse } from "next/server";

// * Schema
import { accountCollection } from "@/db/schema";

// * NPM
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";

// * Libs
import { prisma } from "@/lib/prisma";

// * Extensions
dayjs.extend(advancedFormat);

const organizationId = 1;

import padStart from "lodash/padStart";

export async function GET(req: NextRequest) {
  // await prisma.$executeRaw`ALTER SEQUENCE "Organizations_id_seq" RESTART WITH 1;`;
  // await prisma.$executeRaw`ALTER SEQUENCE "Clients_id_seq" RESTART WITH 1;`;

  return NextResponse.json(
    (
      await prisma.clients.findMany({
        where: { organizationId },
        select: { name: true },
      })
    ).map(({ name }) => name),
  );
}

export async function POST(request: Request) {
  const { client } = await request.json();

  try {
    const clientExists = await clientsCollection.countDocuments({ client });

    if (clientExists > 0)
      return NextResponse.json(
        { icon: "", error: "Duplicate found", message: "Duplicate found" },
        { status: 400 },
      );
    else
      return NextResponse.json(
        await clientsCollection.insertOne({
          client,
          added: { by: "musa" },
          modified: { by: "musa" },
        }),
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

export async function PATCH(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { scope } = Object.fromEntries(searchParams.entries());

  if (scope === "editCell") {
    const { _id, field, value } = await request.json();
    try {
      return NextResponse.json(
        await clientsCollection.findByIdAndUpdate(
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

export async function DELETE(request: Request) {
  const {} = request.json();

  await clientsCollection.deleteMany({});

  return Response.json({ user: 1 }, { status: 204 });
}
