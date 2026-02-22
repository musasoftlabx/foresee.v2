// * Next
import type { NextApiResponse } from "next";

// * Node
import { existsSync } from "fs";
import { chmod, mkdir } from "fs/promises";

// * NPM
import exceljs from "exceljs";

// * Helpers
import { tempPath } from "./configurePaths";
import composeURL from "./composeURL";

export const createWorkBook = (report: string) => {
  // ? Create a new workbook
  const file = new exceljs.Workbook();

  // ? Set workbook metadata
  file.creator = "Dealer Portal";
  file.lastModifiedBy = "Dealer Portal";
  file.created = new Date();
  file.modified = new Date();

  // ? Add worksheet to workbook
  const sheet = file.addWorksheet(report, {
    properties: { tabColor: { argb: "39b54a" }, showGridLines: false },
    views: [{ showGridLines: false }],
  });

  // ? Add the safaricom logo
  const imagePath = `${process.cwd()}/public/images/logos/safaricom_logo_green.png`;
  const imageId = file.addImage({ filename: imagePath, extension: "png" });

  sheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 149, height: 52 },
    hyperlinks: {
      hyperlink: "https://dealerportal.safaricom.co.ke",
      tooltip: "https://dealerportal.safaricom.co.ke",
    },
  });

  return { file, sheet };
};

export const renderSheet = async (
  res: NextApiResponse,
  sheet: any,
  dealerName: string,
  report: string,
  period: string,
  rows: any,
  directory: any,
  file: any,
  filename: any,
  numRowsToAdd: number,
  totalRows: string,
  totalCommissionLabel: string | null,
  totalCommissionValue: string | number | null
) => {
  // TODO: Check why using this inside the loop below causes intensive resource usage.
  const columns = sheet.actualColumnCount;

  // ? Loop through cells to apply styles
  sheet.eachRow({ includeEmpty: false }, (row: any, rowNumber: number) =>
    row.eachCell((cell: any, colNumber: number) => {
      cell.font = { name: "Calibri", family: 2, size: 10 };

      if (rowNumber === 1) {
        row.height = 20;
        cell.font = { name: "Calibri", bold: true };

        for (let i = 1; i <= sheet.actualColumnCount; i++) {
          row.getCell(i).fill = {
            type: "gradient",
            gradient: "angle",
            degree: 90,
            stops: [
              { position: 0, color: { argb: "39b54a" } },
              { position: 1, color: { argb: "FFFFFFFF" } },
            ],
          };

          row.getCell(i).border = {
            bottom: { style: "thick", color: { argb: "39b54a" } },
          };
        }
      }

      if (rowNumber >= 2) {
        for (let i = 1; i <= columns; i++) {
          row.getCell(i).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      }
    })
  );

  for (let i = 1; i <= numRowsToAdd; i++) {
    sheet.insertRow(i, {});
  }

  // ? Set row props
  sheet.getRow(3).height = 18;
  sheet.getRow(5).height = 25;
  sheet.getRow(6).height = 25;
  sheet.getRow(7).height = 5;
  sheet.getRow(8).height = 20;
  sheet.getRow(9).height = 15;

  // ? Style top section
  sheet.getCell("B4").value = {
    richText: [
      {
        font: { name: "Consolas", color: { argb: "00B050" }, size: 15 },
        text: ` ${dealerName}`,
      },
    ],
  };
  sheet.getCell("B4").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "EBF1DE" },
  };
  sheet.getCell("B4").border = {
    top: { style: "thin", color: { argb: "39b54a" } },
    right: { style: "thin", color: { argb: "39b54a" } },
    bottom: { style: "thin", color: { argb: "39b54a" } },
    left: { style: "thick", color: { argb: "39b54a" } },
  };
  sheet.getCell("B5").value = {
    richText: [
      {
        font: { name: "Consolas", size: 12 },
        text: `  ${report} for ${period}`,
      },
    ],
  };
  sheet.getCell("B6").value = {
    richText: [
      {
        font: { name: "Calibri", bold: true, size: 12 },
        text: totalRows,
      },
    ],
  };

  // ? Merge cells
  //sheet.mergeCells("A1:B2");
  sheet.mergeCells("B4:E4");
  sheet.mergeCells("B5:E5");
  sheet.mergeCells("B6:C6");

  if (totalCommissionLabel) {
    // ? Extract alphabets
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));

    // ? Add totals
    const totalsKey = `${alphabet[sheet.actualColumnCount - 2]}8`;
    const totalsValue = `${alphabet[sheet.actualColumnCount - 1]}8`;

    // ? Style totals
    sheet.getCell(totalsKey).value = totalCommissionLabel;
    sheet.getCell(totalsKey).font = { bold: true };
    sheet.getCell(totalsKey).alignment = { vertical: "middle" };
    sheet.getCell(totalsKey).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "6AD079" },
    };
    sheet.getCell(totalsValue).value = {
      formula: totalCommissionValue,
      result: 7,
    };
    sheet.getCell(totalsValue).numFmt = "[$Kes] #,##0.00";
    sheet.getCell(totalsValue).alignment = { vertical: "middle" };
    sheet.getCell(totalsValue).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D8E4BC" },
    };

    // ? Wrap texts
    sheet.getCell(`${alphabet[sheet.actualColumnCount - 2]}8`).alignment = {
      wrapText: true,
    };
    sheet.getCell(`${alphabet[sheet.actualColumnCount - 1]}8`).alignment = {
      wrapText: true,
    };
  }

  // ? Init the directory to place the file
  const directoryPath = `${tempPath}/${directory}`;
  // ? Check if directory exists. If not, create it.
  !existsSync(directoryPath) &&
    (await mkdir(directoryPath, { recursive: true }));
  // ? Change permissions for directory
  await chmod(directoryPath, 0o777);
  // ? Write to file
  file.xlsx.writeFile(`${directoryPath}/${filename}`).then(async () => {
    if (existsSync(`${directoryPath}/${filename}`))
      // ? Change permissions for file
      chmod(`${directoryPath}/${filename}`, 0o777).then(
        () => composeURL(res, directory, filename) // ? Send response as url
      );
    else {
      await file.xlsx.writeFile(`${directoryPath}/${filename}`); // ? Attempt to write to file again
      await chmod(`${directoryPath}/${filename}`, 0o777); // ? Attempt to change permissions for file again
      composeURL(res, directory, filename); // ? Send response as url
    }
  });
};
