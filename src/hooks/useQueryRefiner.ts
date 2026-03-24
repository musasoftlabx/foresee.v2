import { Prisma, type PrismaClient } from "@/generated/prisma/client";
import type { GlobalOmitConfig } from "@/generated/prisma/internal/prismaNamespace";
import { prisma } from "@/lib/prisma";
import type { DefaultArgs } from "@prisma/client/runtime/client";

export type QueryOptions = {
  filterModel: {
    items: { field: string; value: string; operator: string; id: number }[];
    quickFilterValues: [];
    quickFilterLogicOperator: string;
    logicOperator: string;
  };
  sortModel: [];
};

export default async function useQueryRefiner({
  where,
  limit,
  offset,
  refines,
  search,
}: {
  where: {};
  limit: string;
  offset: string;
  refines: string;
  search: { table: string; fields: string[] };
}) {
  const queryOptions = <QueryOptions>JSON.parse(refines);
  const take = Number(limit);
  const skip = take * Number(offset);

  let query: any = {
    where: { ...where },
    orderBy: [{ id: "desc" }],
    take,
    skip,
  };

  let searchResults: any = [];

  if (JSON.stringify(queryOptions) !== "{}") {
    const searchOptions: string[] =
      queryOptions?.filterModel?.quickFilterValues;
    const filterOptions = queryOptions?.filterModel?.items;
    const logicOperator =
      queryOptions?.filterModel?.logicOperator.toUpperCase();
    const sortOptions = queryOptions?.sortModel;

    if (filterOptions?.length > 0) {
      query.where = { ...query.where, [logicOperator]: [] };

      filterOptions.forEach(({ operator }) => {
        const i = filterOptions.findIndex(
          (filter) => filter.operator === operator,
        );

        let filterValue = {};

        switch (operator) {
          case "contains":
            filterValue = {
              contains: filterOptions[i].value,
              mode: "insensitive",
            };
            break;
          case "doesNotContain":
            filterValue = { contains: filterOptions[i].value };
            break;
          case "startsWith":
            filterValue = {
              startsWith: filterOptions[i].value,
              mode: "insensitive",
            };
            break;
          case "endsWith":
            filterValue = {
              endsWith: filterOptions[i].value,
              mode: "insensitive",
            };
            break;
          case "isEqualsTo":
            filterValue = {
              equals: filterOptions[i].value,
              mode: "insensitive",
            };
            break;
          case "isNotEqualsTo":
            filterValue = { not: filterOptions[i].value };
            break;
          case "isEmpty":
            filterValue = { equals: "" };
            break;
          case "isNotEmpty":
            filterValue = { not: "" };
            break;
          case "isNull":
            filterValue = { equals: null };
            break;
          case "isNotNull":
            filterValue = { not: null };
            break;
          case "isBetween":
            filterValue = {
              gte: filterOptions[i].value,
              lte: filterOptions[i].value,
            };
            break;
          case "isNotBetween":
            filterValue = {
              lt: filterOptions[i].value,
              gte: filterOptions[i].value,
            };
            break;
          case "isGreaterThan":
            filterValue = { gt: filterOptions[i].value };

            break;
          case "isGreaterThanOrEqualsTo":
            filterValue = { gte: filterOptions[i].value };

            break;
          case "isLessThan":
            filterValue = { lt: filterOptions[i].value };

            break;
          case "isLessThanOrEqualsTo":
            filterValue = { lte: filterOptions[i].value };

            break;
          case "isAmong":
            filterValue = { in: filterOptions[i].value };

            break;
          case "isNotAmong":
            filterValue = { notIn: filterOptions[i].value };

            break;
          case "isInList":
            filterValue = {
              in: filterOptions[i].value.split(","),
            };
            break;
        }

        query.where[logicOperator].push({
          [filterOptions[i].field]: filterValue,
        });
      });
    }

    if (searchOptions?.length > 0) {
      searchResults = await prisma.$queryRawUnsafe(`
        SELECT id, ${search.fields.join(", ")}
        FROM "${search.table}"
        WHERE search_vector @@ to_tsquery('simple','${searchOptions[0]}')
        LIMIT ${take}
      `);
      // searchResults = await prisma.$queryRaw(Prisma.sql`
      //   SELECT id, ${search.fields.join(", ")}
      //   FROM ${Prisma.raw(capitalize(search.table))} -- ${Prisma.raw(search.table).strings[0]}
      //   WHERE search_vector @@ to_tsquery('simple', 'opre')
      //   LIMIT ${take}
      // `);
    }

    if (sortOptions?.length > 0) {
      Object.assign(
        query.orderBy,
        sortOptions.map(({ field, sort }) => ({ [field]: sort })),
      );
    }
  }

  const table = Prisma.raw(search.table).strings[0].toLocaleLowerCase();
  const totalCount = await prisma[
    table as keyof PrismaClient<
      never,
      GlobalOmitConfig | undefined,
      DefaultArgs
    >
  ].count({ where: { ...where } });

  return { query, searchResults, totalCount };
}
