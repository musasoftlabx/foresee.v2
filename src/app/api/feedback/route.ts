// * Server
import { NextRequest } from "next/server";

// * Schema
import { ballotsCollection } from "../../../db/schema";
import dayjs from "dayjs";

const ballotId = "6834becdfd404b61b54a136c";
const feedback = {
  id: 34532,
  name: "Test Voter 3",
  feedback: "nice system",
  timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { view } = Object.fromEntries(searchParams.entries());
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const res = await ballotsCollection.findByIdAndUpdate(ballotId, {
      $push: { feedback },
    });
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
