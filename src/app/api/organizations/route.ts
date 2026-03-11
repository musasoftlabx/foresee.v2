// * Server
import { NextRequest, NextResponse } from "next/server";

// * Node
import { existsSync } from "fs";

// * Schema
import { accountCollection } from "@/db/schema";

// * NPM
import { ObjectId } from "mongodb";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
import ExcelJS, { CellValue } from "@protobi/exceljs";
import padStart from "lodash/padStart";
import trim from "lodash/trim";

// * Hooks
import { useDayjsDayFormatter } from "@/hooks/useDayjsDayFormatter";
import useAggregateConstructor from "@/hooks/useAggregateConstructor";

// * Helpers
import { tempPath } from "@/helpers/configurePaths";
import { UpdateQuery, UpdateWithAggregationPipeline } from "mongoose";

// * Extensions
dayjs.extend(advancedFormat);

const accountId = "69a08fdd299c12466e5c7ed8";
const username = "mmuliro";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { limit, offset, sortsAndFilters, scope, view } = Object.fromEntries(
    searchParams.entries(),
  );

  if (scope === "__DEFAULT__") {
    const aggregation = await useAggregateConstructor({
      match: { id: accountId },
      limit,
      offset,
      sortsAndFilters,
      searchFields: ["code", "name"],
      extraPipelines: [
        { $unwind: "$stores" },
        {
          $addFields: {
            "stores.inventoryCount": { $size: "$stores.inventory" },
          },
        },
        { $replaceRoot: { newRoot: "$stores" } },
        { $unwind: "$audits" },
        {
          $addFields: {
            "audits.locationsCount": { $size: "$audits.locations" },
            "audits.scansCount": { $size: "$audits.scans" },
          },
        },
        {
          $group: {
            _id: "$_id",
            stores: { $mergeObjects: "$$ROOT" },
            audits: { $push: "$$ROOT.audits" },
          },
        },
        { $addFields: { "stores.audits": "$audits" } },
        { $replaceRoot: { newRoot: "$stores" } },
      ],
      project: {
        "stores.inventory": 0,
        "audits.locations": 0,
        "audits.scans": 0,
      },
    });

    //console.log(aggregation);

    const dataset = await accountCollection.aggregate(aggregation);

    if (view === "__DISPLAY__") {
      try {
        return Response.json({
          count: dataset.length,
          dataset: dataset.map((field) => ({
            ...field,
            created: {
              ...field.created,
              on: useDayjsDayFormatter(field.created.on),
            },
            modified: {
              ...field.modified,
              on: useDayjsDayFormatter(field.modified.on),
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

export async function POST(request: Request) {
  const {
    name,
    country: { code, name: country },
    client,
    inventory: {
      file: { filename, sheetFields },
    },
    audit: {
      date,
      barcode: { mode, characters },
      locations,
    },
  } = await request.json();

  try {
    const path = `${tempPath}/${filename}`;

    if (existsSync(path)) {
      const workbookReader: ExcelJS.stream.xlsx.WorkbookReader =
        new ExcelJS.stream.xlsx.WorkbookReader(path, {});

      let inventory = [];

      const fields = [
        "", // ? Included to align to excel's initial empty row cell
        ...sheetFields.map(({ mapsTo }: { mapsTo: string }) => mapsTo),
      ];

      for await (const worksheetReader of workbookReader) {
        if (worksheetReader.id === 1) {
          for await (const row of worksheetReader) {
            if (row.number > 1) {
              let obj = {};
              // console.log(row.values.filter((row)=> ({
              //   fields[0]: row[0]
              // })));
              row.values.forEach((cell, i: number) => {
                return (obj[fields[i]] =
                  typeof cell === "object" ? trim(cell.result) : trim(cell));
              });

              inventory.push(obj);
            }
          }
        }
      }

      // ? Check if the incoming client exists
      const clientExists = await accountCollection.findOne({
        _id: accountId,
        clients: { $elemMatch: { name: client } },
      });

      // ?  If client doesn't exist, add the client
      if (!clientExists)
        await accountCollection.updateOne(
          { _id: accountId },
          {
            $push: {
              clients: {
                name: client,
                added: { by: username },
                modified: { by: username },
              },
            },
          },
        );

      // ? Get number of stores with similar country codes (Used aggregation as find does not support non existent field projection)
      const storeCount = await accountCollection.aggregate([
        {
          $match: {
            $and: [
              { _id: new ObjectId(accountId) },
              { "stores.code": { $regex: `^${code}` } },
            ],
          },
        },
        { $project: { _id: 0, storeCount: { $size: "$stores" } } },
      ]);

      // ? If no stores, skip to 1 to start store count at 1
      const storePadding =
        storeCount.length === 0 ? 1 : storeCount[0].storeCount + 1;

      // ? Add padding to store count if less than 2 characters
      const storeCode = `${code}${padStart(storePadding.toString(), 2, "0")}`;

      // ? Get number of audits
      const auditCount = (
        await accountCollection.findOne(
          { _id: accountId },
          { _id: 0, stores: { $size: "$stores.audits" } },
        )
      ).stores[0];

      // ? If no audits, skip to 1 to start store count at 1
      const auditPadding = auditCount === 0 ? 1 : auditCount + 1;

      // ? Add padding to audit count if less than 5 characters
      const auditCode = `A-${padStart(auditPadding.toString(), 5, "0")}`;

      return NextResponse.json(
        await accountCollection.updateOne(
          { _id: accountId },
          {
            $push: {
              stores: {
                code: storeCode,
                name,
                country,
                client,
                added: { by: username },
                modified: { by: username },
                inventory,
                audits: [
                  {
                    name: auditCode,
                    date: new Date(date),
                    barcode: {
                      mode,
                      characters: mode === "strict" ? characters[0] : 0,
                    },
                    locations: Array.from({ length: locations }).map(
                      (_, i) => ({
                        code: `L${padStart((i + 1).toString(), 4, "0")}-${storeCode}-${dayjs(date).format("YYYYMMDD")}`,
                        created: { by: username },
                        modified: { by: username },
                      }),
                    ),
                  },
                ],
              },
            },
          },
        ),
        { status: 201 },
      );
    } else throw Error("hgyt");

    // const storeExists = await accountCollection.findOne({
    //   stores: { $elemMatch: { name: "abc" } },
    // });
    // return NextResponse.json(storeExists, { status: 400 });
    // const storeExists = await accountCollection.aggregate([
    //   { $addFields: { stores: { $unwind: "$name" } } },
    //   { $match: { stores: { $in: "$name" } } },
    //   {project}
    // ]);
    // if (storeExists > 0)
    //   return NextResponse.json(
    //     { icon: "", error: "Duplicate found", message: "Duplicate found" },
    //     { status: 400 },
    //   );
    // else
    //   return NextResponse.json(
    //     await accountCollection.insertOne({
    //       client,
    //       added: { by: "musa" },
    //       modified: { by: "musa" },
    //     }),
    //     { status: 201 },
    //   );
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
        await accountCollection.findByIdAndUpdate(
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

export async function DELETE(request: NextRequest) {
  const { storeIds } = await request.json();

  const updateQuery = () => {
    if (storeIds.length === 0) return { $set: { stores: [] } };
    else
      return {
        $pull: {
          stores: {
            _id: {
              $in: storeIds.map((storeId: string) => new ObjectId(storeId)),
            },
          },
        },
      };
  };

  try {
    return NextResponse.json(
      await accountCollection.updateOne({ _id: accountId }, updateQuery()),
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

// {
//   $addFields: {
//     "audits.idp": "$audits._id",
//     "audits.idf": "$$CURRENT.audits.audit",
//     "audits.locationsCount": {
//       $let: {
//         vars: {
//           //idd: {$toString: "$audit._id" },
//           idd: {
//            	$indexOfArray: [
//                 "$$CURRENT.audits._id",
//                 {$toString: "_id.$" }
//               ]
//           },
//           locations: {
//             $map: {
//               input: "$audits",
//               as: "audit",
//               in: {
//                 id: {
//                   $toString: "$$audit._id"
//                 },
//                 size: {
//                   $size: "$$audit.locations"
//                 }
//               }
//             }
//           }
//         },
//         in: {
//           //{$toString:"$$idd"}
//           $arrayElemAt: [
//             "$$locations.size",
//             "$$idd"
//             // {
//             //   $indexOfArray: [
//             //     "$$locations.id",
//             //     {
//             //       $toString: {
//             //         $first:
//             //           "$$CURRENT.audits._id"
//             //       }
//             //     }
//             //   ]
//             // }
//           ]
//         }
//       }
//     }
//     // "audits.productsCount": {
//     //   $first: {
//     //     $map: {
//     //       input: "$audits",
//     //       as: "audit",
//     //       in: { $size: "$$audit.products" }
//     //     }
//     //   }
//     // }
//   }
// }
