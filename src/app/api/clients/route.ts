// * Server
import { NextRequest, NextResponse } from "next/server";

// * Schema
import { clientsCollection } from "@/db/schema";

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
    // const test = await clientsCollection.aggregate([
    //   {
    //     $addFields: {
    //       id: { $toString: "$_id" },
    //       searchFields: {
    //         $concat: ["$client", " ", "$added.by", " ", "$modified.by"],
    //       },
    //     },
    //   },
    //   {
    //     $match: {
    //       $or: [
    //         { searchFields: { $regex: "", $options: "i" } },
    //         { id: { $regex: "698b9c36802c5c281c1c6276", $options: "i" } },
    //         { client: { $regex: "abc", $options: "i" } },
    //         { "added.by": { $regex: "brian", $options: "i" } },
    //       ],
    //     },
    //   },
    //   // {
    //   //   $addFields: {
    //   //     test: {
    //   //       $function: {
    //   //         body: function (arg: string) {
    //   //           return arg;
    //   //         },
    //   //         args: ["$added.on"],
    //   //         lang: "js",
    //   //       },
    //   //     },
    //   //   },
    //   // },
    //   { $sort: { _id: -1 } },
    //   {
    //     $project: {
    //       id: 0,
    //       fieldToExclude: 0,
    //     },
    //   },
    // ]);
    const dataset = await useAggregateConstructor({
      limit,
      offset,
      options,
      searchFields: ["client", "added.by", "modified.by"],
    });

    if (view === "display") {
      try {
        return Response.json({
          count: dataset.length,
          dataset: dataset.map((field) => ({
            ...field,
            added: {
              ...field.added,
              on: dayjs(field.added.on).format(
                "ddd, Do MMM YYYY [at] hh:mm:ss a",
              ),
            },
            modified: {
              ...field.modified,
              on: dayjs(field.modified.on).format(
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
  }
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

// dataset: (
//   await clientsCollection
//     //.find(filter)
//     .find({
//       $or: [
//         { client: { $regex: "abc" } },
//         { "added.by": { $regex: "brian" } },
//       ],
//       // $and: [
//       //   { client: { $regex: "abc1234" } },
//       //   { "added.by": { $regex: "brian", $options: "i" } },
//       // ],
//     })
//     .sort({ _id: -1 })
//     .skip(__offset)
//     .limit(__limit)
// ).map((client) => ({
//   ...client._doc,
//   added: {
//     ...client._doc.added,
//     on: dayjs(client.added.on).format(
//       "ddd, Do MMM YYYY [at] hh:mm:ss a",
//     ),
//   },
//   modified: {
//     ...client._doc.modified,
//     on: dayjs(client.modified.on).format(
//       "ddd, Do MMM YYYY [at] hh:mm:ss a",
//     ),
//   },
// })),
