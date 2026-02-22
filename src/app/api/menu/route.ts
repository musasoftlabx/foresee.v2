// * NPM
import got from "got";

// * Helpers
import proxy from "@/helpers/effectProxy";
import { NextRequest } from "next/server";

type Users = {}[];

/* {
  limit: '20',
  offset: '0',
  view: 'display',
  options: '{"sortModel":[{"field":"id","sort":"desc"}]}',
  scope: 'users'
} */

type SearchParams = {
  limit: string;
  offset: string;
  view: "display" | "export";
  options: string;
  scope: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const searchParams = req.nextUrl.searchParams;
  const { view } = <SearchParams>Object.fromEntries(searchParams.entries());

  const dataset: Users = await got(
    "https://650d8d1aa8b42265ec2c60ae.mockapi.io/users",
    proxy()
  ).json();

  if (view === "display")
    return Response.json({ count: dataset.length, dataset });

  if (view === "export")
    return Response.json({ count: dataset.length, dataset });
}

export async function POST(request: Request) {
  const body = await request.json();

  return Response.json(body, { status: 201 });
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
