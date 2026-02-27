// * Server
import { NextRequest, NextResponse } from "next/server";

// * Schema
import { productsCollection } from "@/db/schema";

// * NPM
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";

// * Hooks
import useAggregateConstructor from "@/hooks/useAggregateConstructor";

// * Extensions
dayjs.extend(advancedFormat);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { limit, offset, options, scope, view } = Object.fromEntries(
    searchParams.entries(),
  );

  if (scope === "__DEFAULT__") {
    const dataset = await useAggregateConstructor({
      limit,
      offset,
      options,
      searchFields: ["barcode", "location", "attributes.name", "scanned.by"],
    });

    if (view === "__DISPLAY__") {
      try {
        return Response.json({
          count: dataset.length,
          dataset: dataset.map((field) => ({
            ...field,
            scanned: {
              ...field.scanned,
              on: dayjs(field.scanned.on).format(
                "ddd, Do MMM YYYY [at] hh:mm:ss a",
              ),
            },
          })),
        });
      } catch (err) {
        if (err instanceof Error)
          return Response.json({ error: err.message }, { status: 500 });
      }
    }

    if (view === "__EXPORT__") {
    }
  }
}

export async function POST(request: Request) {
  const { client } = await request.json();

  try {
    const clientExists = await productsCollection.countDocuments({ client });

    if (clientExists > 0)
      return NextResponse.json(
        { icon: "", error: "Duplicate found", message: "Duplicate found" },
        { status: 400 },
      );
    else
      return NextResponse.json(
        await productsCollection.insertOne({
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
        await productsCollection.findByIdAndUpdate(
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

  await productsCollection.deleteMany({});

  return Response.json({ user: 1 }, { status: 204 });
}
