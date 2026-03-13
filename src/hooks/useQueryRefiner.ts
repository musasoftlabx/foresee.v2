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
}: {
  where: {};
  limit: string;
  offset: string;
  refines: string;
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

  if (JSON.stringify(queryOptions) !== "{}") {
    const searchOptions: string[] =
      queryOptions?.filterModel?.quickFilterValues;
    const filterOptions = queryOptions?.filterModel?.items;
    const logicOperator =
      queryOptions?.filterModel?.logicOperator.toUpperCase();
    const sortOptions = queryOptions?.sortModel;

    query.where = { ...query.where, [logicOperator]: [] };

    if (filterOptions?.length > 0) {
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

    /* if (searchOptions?.length > 0) {
      const concats: string[] = aggregation[0].$addFields.search.$concat;

      refines.searchFields.map((field, index) => {
        concats.push(`$${field}`);
        index !== refines.searchFields.length - 1 && concats.push(" ");
      });

      if (Object.hasOwn(query.where, "$or")) {
        query.where.$or.push({
          search: { $regex: searchOptions[0], $options: "i" },
        });
      } else {
        query.where.$or = query.where.$and;
        delete query.where.$and;
        query.where.$or.push({
          search: { $regex: searchOptions[0], $options: "i" },
        });
      }
    } */

    if (sortOptions?.length > 0) {
      Object.assign(
        query.orderBy,
        sortOptions.map(({ field, sort }) => ({ [field]: sort })),
      );
    }
  }

  return query;
}
