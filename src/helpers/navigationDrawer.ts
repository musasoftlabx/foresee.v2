// * NPM
import { DB } from "./DB.connect";

export default async function navigationDrawer(dealerCode: string) {
  let parents = await DB.getall(
    `SELECT * FROM dp_drawer_links WHERE childOf IS NULL${
      process.env.NEXT_PUBLIC_URL.includes("dealer") ? " AND visible = 1" : ""
    } ORDER BY priority`
  );
  const children = await DB.getall(
    `SELECT * FROM dp_drawer_links WHERE childOf IS NOT NULL${
      process.env.NEXT_PUBLIC_URL.includes("dealer") ? " AND visible = 1" : ""
    }`
  );

  children.map((child, i) => {
    const index = parents.findIndex((parent) => parent.name === child.childOf);
    if (index > 0) {
      !parents[index].children
        ? (parents[index].children = [child])
        : parents[index].children.push(child);
    }
    parents[index].isSelected = false;
  });

  return [
    ...parents.map((parent) => {
      parent.isExpanded === 1
        ? (parent.isExpanded = true)
        : (parent.isExpanded = false);
      parent.isNew === 1 ? (parent.isNew = true) : (parent.isNew = false);
      return parent;
    }),
  ];
}
