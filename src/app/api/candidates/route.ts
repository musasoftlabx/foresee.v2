// * Server
import { NextRequest } from "next/server";

// * Schema
import { ballotsCollection } from "../../../db/schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { view } = Object.fromEntries(searchParams.entries());

  //console.log(view);

  try {
    const candidates = await ballotsCollection.aggregate([
      {
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: "6834becdfd404b61b54a136c" }] },
          //alias: "usiu26se"
        },
      },
      { $unwind: "$dockets" },
      { $match: { "dockets.docket": "Chair" } },
      { $unwind: "$dockets.candidates" },
      { $project: { _id: 0, candidates: "$dockets.candidates" } },
      {
        $project: {
          candidates: {
            _id: 1,
            name: {
              $concat: [
                "$candidates.firstName",
                " ",
                "$candidates.middleName",
                " ",
                "$candidates.lastName",
              ],
            },
            nickName: 1,
            party: 1,
            photo: 1,
          },
        },
      },
      { $replaceRoot: { newRoot: "$candidates" } },
    ]);
    return Response.json(candidates);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  return Response.json(await ballotsCollection.insertOne(body), {
    status: 201,
  });
}

export async function PUT(request: Request) {
  const {} = request.json();
  return Response.json({ user: 1 }, { status: 201 });
}

export async function PATCH(request: Request) {
  const {} = request.json();
  return Response.json({ user: 1 }, { status: 201 });
}

export async function DELETE(request: Request) {
  const {} = request.json();
  return Response.json({ user: 1 }, { status: 204 });
}
