export type TQueryOptions = {
  filterModel: {
    items: { field: string; value: string; operator: string; id: number }[];
    quickFilterValues: [];
    quickFilterLogicOperator: string;
    logicOperator: string;
  };
  sortModel: [];
};

export type TAggregation = [
  { $addFields: { id: { $toString: "$_id" }; search: { $concat: string[] } } },
  { $match: { $or?: never; $and?: never } },
  { $limit: Number },
  { $skip: Number },
  { $sort: { _id: Number } },
  { $project: { id: Number; fieldToExclude: Number } },
];

export default async function useAggregateConstructor({
  limit,
  offset,
  options,
  searchFields,
}: {
  limit: string;
  offset: string;
  options: string;
  searchFields: string[];
}) {
  const queryOptions = <TQueryOptions>JSON.parse(options);
  const $limit = Number(limit);
  const $skip = $limit * Number(offset);

  const aggregation: any = [
    { $addFields: { id: { $toString: "$_id" }, search: { $concat: [] } } },
    { $match: {} },
    { $limit },
    { $skip },
    { $sort: { _id: -1 } },
    { $project: { id: 0, fieldToExclude: 0 } },
  ];

  if (JSON.stringify(queryOptions) !== "{}") {
    const searchOptions: string[] =
      queryOptions?.filterModel?.quickFilterValues;
    const filterOptions = queryOptions?.filterModel?.items;
    const logicOperator = queryOptions?.filterModel?.logicOperator;
    const sortOptions = queryOptions?.sortModel;

    if (filterOptions?.length > 0) {
      filterOptions.forEach(({ operator }) => {
        switch (operator) {
          case "contains":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $regex: filter.value, $options: "i" },
              })),
            });
            break;
          case "doesNotContain":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: {
                  $regex: `^((?!${filter.value}).)*$`,
                  $options: "i",
                },
              })),
            });
            break;
          case "startsWith":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $regex: `^${filter.value}`, $options: "i" },
              })),
            });
            break;
          case "endsWith":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $regex: `${filter.value}$`, $options: "i" },
              })),
            });
            break;
          case "isEqualsTo":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $eq: filter.value },
              })),
            });
            break;
          case "isNotEqualsTo":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $ne: filter.value },
              })),
            });
            break;
          case "isEmpty":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $eq: "" },
              })),
            });
            break;
          case "isNotEmpty":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $ne: "" },
              })),
            });
            break;
          case "isNull":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $eq: null },
              })),
            });
            break;
          case "isNotNull":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $ne: null },
              })),
            });
            break;
          case "isBetween":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $gte: filter.value, $lte: filter.value },
              })),
            });
            break;
          case "isNotBetween":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $lt: filter.value, $gte: filter.value },
              })),
            });
            break;
          case "isGreaterThan":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $gt: filter.value },
              })),
            });
            break;
          case "isGreaterThanOrEqualsTo":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $gte: filter.value },
              })),
            });
            break;
          case "isLessThan":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $lt: filter.value },
              })),
            });
            break;
          case "isLessThanOrEqualsTo":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $lte: filter.value },
              })),
            });
            break;
          case "isAmong":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $in: filter.value },
              })),
            });
            break;
          case "isNotAmong":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $nin: filter.value },
              })),
            });
            break;
          case "isInList":
            Object.assign(aggregation[1].$match, {
              [`$${[logicOperator]}`]: filterOptions.map((filter) => ({
                [filter.field]: { $in: filter.value.split(",") },
              })),
            });
            break;
        }
      });
    }

    if (searchOptions?.length > 0) {
      const concats: string[] = aggregation[0].$addFields.search.$concat;

      searchFields.map((field, index) => {
        concats.push(`$${field}`);
        index !== searchFields.length - 1 && concats.push(" ");
      });

      if (Object.hasOwn(aggregation[1].$match, "$or")) {
        aggregation[1].$match.$or.push({
          search: { $regex: searchOptions[0], $options: "i" },
        });
      } else {
        aggregation[1].$match.$or = aggregation[1].$match.$and;
        delete aggregation[1].$match.$and;
        aggregation[1].$match.$or.push({
          search: { $regex: searchOptions[0], $options: "i" },
        });
      }
    }

    if (sortOptions?.length > 0) {
      aggregation[4].$sort = {};
      sortOptions.forEach(
        ({ field, sort }) =>
          (aggregation[4].$sort[field] = sort === "desc" ? -1 : 1),
      );
    }
  }

  return aggregation;
}
