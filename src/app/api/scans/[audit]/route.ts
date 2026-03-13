// * Server
import { NextRequest, NextResponse } from "next/server";

// * Schema
import { accountCollection } from "@/db/schema";

// * NPM
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

// * Hooks
import { useDayjsDayFormatter } from "@/hooks/useDayjsDayFormatter";
import useAggregateConstructor from "@/hooks/useQueryRefiner";

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
        { $match: { _id: new ObjectId(auditId) } },
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
          dataset: dataset.map((field) => ({
            ...field,
            scanned: {
              ...field.scanned,
              on: useDayjsDayFormatter(field.scanned.on),
            },
          })),
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
