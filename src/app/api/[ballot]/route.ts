import { NextRequest } from "next/server";

// * Helpers
import { clientsCollection } from "@/db/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ballot: string }> },
) {
  try {
    //const ballot = req.url.split("/").at(-1), // TODO: To use if using virtual urls
    const ballot = (await params).ballot;
    const res = await clientsCollection.findOne({ ballot });
    return Response.json(res, { status: 201 });
  } catch (err) {
    return Response.json("that ballot not found", { status: 404 });
  }
}
