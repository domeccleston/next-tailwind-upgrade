import fs from "fs";
import { argv } from "node:process";
import { execSync } from "child_process";

// check that this is being run in root of next.js project
// look for next.config.js
// find out current package manager
// if yarn.lock present, use yarn
// if package-lock.json present, use npm
// if pnpm-lock.yaml, use pnpm
// if multiple present, exit
// based on that, install dependencies for tailwind using package manager
// create tailwind.config.js and add files for next
// find out next.js version from package.json
// if 12, look for ./styles/globals.css
// if not present, create it and add directives
// otherwise overwrite with directives
// look for _app.[t|j]sx?
// if not present, add import
// if 13, look for ./app/globals.css
// if not present, create it and add directives
// otherwise overwrite with directives

function readPackageJson(dir) {
  try {
    const packageJsonContents = fs.readFileSync(
      dir + "/" + "package.json",
      "utf8"
    );
    return JSON.parse(packageJsonContents);
  } catch (error) {
    console.error("Error reading package.json. File is missing or invalid.");
  }
}

function detectPackageManager(files) {
  let packageManagers = [];
  if (files.includes("yarn.lock")) packageManagers.push("yarn");
  if (files.includes("package-lock.json")) packageManagers.push("npm");
  if (files.includes("pnpm-lock.yaml")) packageManagers.push("pnpm");
  if (packageManagers.length > 1)
    throw new Error(
      "Multiple package managers detected. Please commit to one."
    );
  return packageManagers[0];
}

function installDependencies(packageManager) {
  const result = execSync(
    `cd ${dir} && ` +
    installCommands[packageManager] + " " + tailwindDependencies
  ).toString();
  return result;
}

function createTailwindConfig() {
  execSync(`cd ${dir} && touch tailwind.config.js`);
  execSync(`cat ${tailwindNextConfig} tailwind.config.js`)
}

const installCommands = {
  yarn: "yarn add -D",
  pnpm: "pnpm install -D",
  npm: "npm install -D",
};

const tailwindDependencies = "tailwindcss postcss autoprefixer";

let dir;
if (argv[2]) {
  dir = argv[2];
} else {
  dir = ".";
}
const files = fs.readdirSync(dir);
const packageManager = detectPackageManager(files);
if (!files.includes("next.config.js")) {
  throw new Error("Script can only be run in root of a Next.js project.");
}
const packageJsonContents = readPackageJson(dir);
const output = installDependencies(packageManager);
createTailwindConfig();
console.log(output);
