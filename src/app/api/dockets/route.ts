// * Server
import { NextRequest } from "next/server";

// * Schema
import { ballotsCollection } from "../../../db/schema";
import { truncate } from "fs";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { view } = Object.fromEntries(searchParams.entries());

  try {
    const dockets = await ballotsCollection.aggregate([
      { $unwind: { path: "$dockets" } },
      {
        $project: {
          _id: 0,
          docket: "$dockets.docket",
          description: "$dockets.description",
        },
      },
    ]);

    const voted = (
      await ballotsCollection.aggregate([
        { $match: { ballot: "usiu26se", "voters.authId": "637260" } },
        { $project: { _id: 0, "voters.voted": 1 } },
        { $unwind: { path: "$voters" } },
        { $replaceRoot: { newRoot: "$voters" } },

        // { $match: { ballot: "usiu26se" } },
        // { $project: { _id: 0, voters: 1 } },
        // { $unwind: { path: "$voters" } },
        // { $replaceRoot: { newRoot: "$voters" } },
        // { $project: { voted: "$voted" } },
      ])
    )[0].voted;

    const _dockets = dockets.filter(({ docket }) => {
      if (!voted.includes(docket)) return docket;
    });

    return Response.json(_dockets);
  } catch (err: any) {
    console.error(err.message);
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
