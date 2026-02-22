interface iSort {
  field: string;
  sort: string;
}

export default function sharedSortOptions(filter: string, sortOptions: any) {
  let order = " ORDER BY ";
  sortOptions.forEach(({ field, sort }: iSort, i: number) => {
    order += `${field} ${sort.toUpperCase()}`;
    i !== sortOptions.length - 1 && (order += `, `);
  });
  filter += `${order}`;

  return order;
}
