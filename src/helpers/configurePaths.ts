// * Node
import { existsSync, mkdirSync, chmodSync } from "fs";
import subProcess from "child_process";

// * NPM
import slash from "slash";

const processcwd = process.cwd(); // ? Get the current working directory (/Users/mmuliro/Documents/projects/e-ballot)
const cwd = processcwd.split("/"); // ? Transform to array ["Users", "mmuliro", "Documents", "projects", "e-ballot"]

// ? Keep files within working directory under server directory
const fsPath = `${processcwd}/server`; // ? Formulate fs directory (/Users/mmuliro/Documents/projects/e-ballot/server)
const ballotsPath = `${fsPath}/ballots`;
const logsPath = `${fsPath}/logs`;
const tempPath = `${fsPath}/temp`;

// ? Create directory if not exists only in development, in production, they are created by Gitlab Actions
if (process.env.NODE_ENV === "development") {
  !existsSync(ballotsPath) &&
    mkdirSync(ballotsPath, { recursive: true }) &&
    chmodSync(ballotsPath, 0o777);
  !existsSync(logsPath) &&
    mkdirSync(logsPath, { recursive: true }) &&
    chmodSync(logsPath, 0o777);
  !existsSync(tempPath) &&
    mkdirSync(tempPath, { recursive: true }) &&
    chmodSync(tempPath, 0o777);
}

// ? Path to create hardlink on windows
let hardLinkPath: string = `${processcwd}\\src\\app\\api\\assets`;
let createLinkCommand = `mklink /j ${hardLinkPath} ${cwd.join("\\")}`;

// ? Check OS to determine slashes in path (UNIX systems)
if (!process.env.os?.includes("Windows")) {
  hardLinkPath = slash(hardLinkPath);
  createLinkCommand = `ln -s ${fsPath} ${hardLinkPath}`;
}

// ? Create link if it does not exist
if (process.env.NODE_ENV === "development" && !existsSync(hardLinkPath)) {
  mkdirSync(hardLinkPath, { recursive: true }) &&
    chmodSync(hardLinkPath, 0o777);

  subProcess.exec(createLinkCommand, (err, stdout, stderr) => {
    if (err) console.error(err);
    else {
      console.log(`stdout: ${stdout.toString()}`);
      console.log(`stderr: ${stderr.toString() || "No err"}`);
    }
  });
}

export { cwd, ballotsPath, fsPath, logsPath, tempPath };

// ? Keep files outside working directory
// cwd.splice(-1); // ? Remove last element to move an upper directory ["Users", "mmuliro", "Documents", "projects"]
// const CWD = cwd.join("/"); // ? Transform back to string (/Users/mmuliro/Documents/projects)
// const fsPath = `${CWD}/fs/${process.env.npm_package_name}`; // ? Formulate fs directory (/Users/mmuliro/Documents/projects/fs)
