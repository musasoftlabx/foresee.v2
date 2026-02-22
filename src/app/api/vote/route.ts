// * Server
import { NextRequest } from "next/server";

// * Schema
import { ballotsCollection } from "../../../db/schema";
import dayjs from "dayjs";

const user = {
  id: 34532,
  name: "Test Voter 3",
  timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { view } = Object.fromEntries(searchParams.entries());
}

export async function POST(request: Request) {
  const { ballotId } = await request.json();

  try {
    const res = await ballotsCollection.findByIdAndUpdate(
      ballotId,
      // {
      //   // $match: {
      //   //   $expr: { $eq: ["$_id", { $toObjectId: "6834becdfd404b61b54a136c" }] },
      //   // },
      //   //alias: "usiu26se",
      // },
      {
        $inc: { "dockets.$[dockets].candidates.$[candidates].votes": 1 },
        $push: { "dockets.$[dockets].candidates.$[candidates].voters": user },
      },
      {
        arrayFilters: [
          { "dockets.docket": "Chair" },
          { "candidates.firstName": "Musa" },
        ],
      }
    );
    return Response.json(res, { status: 201 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
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
