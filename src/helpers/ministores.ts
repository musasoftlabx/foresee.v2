// * NPM
import { DB } from "./DB.connect";
import uniqBy from "lodash/uniqBy";

export default async function ministores(
  dealerCode: string,
  productCode: string
) {
  const staticProductsInMinistore = await DB.getvals(
    `SELECT productCode FROM dp_ministores_static_products`
  );

  let dataset = [];

  if (staticProductsInMinistore.includes(productCode))
    dataset = await DB.getall(
      `SELECT ministoreId AS id, ministore
      FROM dp_ministores_static_products
      WHERE productCode = ?
      ORDER BY ministore`,
      [productCode]
    );
  else
    dataset = await DB.getall(
      `SELECT ministoreId AS id, ministore
        FROM dp_ministore_dealer_mappings
        WHERE dealerCode = ?
        ORDER BY ministore`,
      [dealerCode]
    );

  return uniqBy(dataset, "ministore");
}
