// * Server
import { NextRequest, NextResponse } from "next/server";

// * Schema
import { accountCollection } from "@/db/schema";

// * NPM
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

// * Hooks
import useAggregateConstructor from "@/hooks/useAggregateConstructor";

// * Extensions
dayjs.extend(advancedFormat);

const id = "69a08fdd299c12466e5c7ed8";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const auditId = req.nextUrl.pathname.split("/")[3];
  const { limit, offset, sortsAndFilters, scope, view } = Object.fromEntries(
    searchParams.entries(),
  );

  if (scope === "__DEFAULT__") {
    const aggregation = await useAggregateConstructor({
      match: { id },
      limit,
      offset,
      sortsAndFilters,
      searchFields: ["code", "name"],
      extraPipelines: [
        { $unwind: "$stores" },
        { $replaceRoot: { newRoot: "$stores" } },
        { $unwind: "$audits" },
        { $replaceRoot: { newRoot: "$audits" } },
        { $addFields: { id: { $toString: "$_id" } } },
        { $match: { id: auditId } },
        { $unwind: "$scans" },
        { $replaceRoot: { newRoot: "$scans" } },
      ],
      project: {
        "audits.locations": 0,
        "audits.inventory": 0,
        "audits.scans": 0,
      },
    });

    const dataset = await accountCollection.aggregate(aggregation);

    if (view === "__DISPLAY__") {
      try {
        return Response.json({
          count: dataset.length,
          // dataset: dataset.map((field) => ({
          //   ...field,
          //   scanned: {
          //     ...field.scanned,
          //     on: useDayjsDayFormatter(field.scanned.on),
          //   },
          // })),
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

export async function POST(request: NextRequest) {
  const {
    storeId,
    auditId,
    location,
    barcode,
    scanned: { device },
  } = await request.json();

  try {
    return NextResponse.json(
      await accountCollection.updateOne(
        { _id: id },
        {
          $push: {
            "stores.$[store].audits.$[audit].scans": {
              location,
              barcode,
              scanned: { by: "musa", device },
            },
          },
        },
        {
          arrayFilters: [
            { "store._id": new ObjectId(storeId) },
            { "audit._id": new ObjectId(auditId) },
          ],
        },
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
  const { storeId, auditId, auditIds, scanId, howMany } = await request.json();

  const prepareDeletions = () => {
    switch (howMany) {
      case "__ONE__":
        return {
          $pull: {
            "stores.$[store].audits.$[audit].scans": {
              _id: new ObjectId(scanId),
            },
          },
        };
      case "__MANY__":
        return {
          $pull: {
            "stores.$[store].audits.$[audit].scans": {
              _id: { $in: auditIds },
            },
          },
        };
      case "__ALL__":
        return { $set: { "stores.$[store].audits.$[audit].scans": [] } };
    }
  };

  if (howMany === "__ONE__") {
    try {
      return NextResponse.json(
        await accountCollection.updateOne({ _id: id }, prepareDeletions(), {
          arrayFilters: [
            { "store._id": new ObjectId(storeId) },
            { "audit._id": new ObjectId(auditId) },
          ],
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
}
