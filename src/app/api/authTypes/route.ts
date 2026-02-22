// * Server
import { NextRequest } from "next/server";

// * Schema
import { authTypesCollection } from "@/db/schema";
import { logger } from "@/logs";
import errorHandler from "@/helpers/errorHandler";

export async function GET(req: NextRequest) {
  try {
    const collection = await authTypesCollection.findOne(
      {},
      { _id: 0, types: 1 }
    );
    return Response.json(collection);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  return Response.json(await authTypesCollection.insertOne(body), {
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
