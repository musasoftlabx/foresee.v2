// * NPM
import got from "got";

// * Helpers
import proxy from "@/helpers/effectProxy";
import { NextRequest } from "next/server";
import { ballotsCollection, ballotsSchema } from "@/db/schema";
import { Ballot, Voter } from "../../../../../../types";

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ ballot: string }> }
) {
  const ballot = (await params).ballot;
  const { authId } = await request.json();

  try {
    // const res = await ballotsCollection.findOne(
    //   { ballot, "voters.authId": authId },
    //   { _id: 0, "voters.$": 1 }
    // );

    const voter: Voter = (
      await ballotsCollection.aggregate([
        { $match: { "voters.authId": authId, ballot } },
        { $project: { _id: 0, voters: 1 } },
        { $unwind: "$voters" },
        { $replaceRoot: { newRoot: "$voters" } },
        // {
        //   $replaceRoot: {
        //     newRoot: {
        //       $mergeObjects: [{ $arrayElemAt: ["$voters", 0] }, "$$ROOT"],
        //     },
        //   },
        // },
      ])
    )[0];

    if (voter) {
      if (voter.phoneNumber) {
        //sendSMS
        return Response.json({
          subject: "Passcode sent",
          body: "We sent a passcode to your phone number.",
        });
      } else if (voter.emailAddress) {
        // sendEmail
        return Response.json({
          subject: "Email sent",
          body: "We sent a passcode to your email.",
        });
      }
    } else {
      return Response.json(
        { subject: "Not eligible", body: "That ID is not eligible to vote." },
        { status: 404 }
      );
    }
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
