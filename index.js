#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from "fs";
import { argv } from "node:process";
import { execSync } from "child_process";

function readPackageJson(dir) {
  try {
    const packageJsonContents = readFileSync(
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
      installCommands[packageManager] +
      " " +
      tailwindDependencies
  ).toString();
  return result;
}

function createTailwindConfig() {
  if (readdirSync(dir).includes("tailwind.config.js")) {
    execSync(`cd ${dir} && rm tailwind.config.js`);
  } else {
    execSync(`cd ${dir} && touch tailwind.config.js`);
  }
  writeFileSync(`${dir}/tailwind.config.js`, tailwindNextConfig);
  return;
}

function getNextVersion() {
  if (readdirSync(dir).includes("app")) return "new";
  else return "old";
}

function applyTailwindDirectives(nextVersion) {
  let globalCssFile;
  if (nextVersion === "old") {
    globalCssFile = "styles/globals.css";
  } else if (nextVersion === "new") {
    globalCssFile = "app/globals.css";
  }
  writeFileSync(`${dir}/${globalCssFile}`, tailwindDirectives);
}

function initTailwind() {
  execSync(`cd ${dir} && ${execCommands[packageManager]} tailwindcss init -p`);
}

const tailwindNextConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

const installCommands = {
  yarn: "yarn add -D",
  pnpm: "pnpm install -D",
  npm: "npm install -D",
};

const execCommands = {
  yarn: "npx",
  npm: "npx",
  pnpm: "pnpm exec",
};

const tailwindDependencies = "tailwindcss postcss autoprefixer";

let dir;
if (argv[2]) {
  dir = argv[2];
} else {
  dir = ".";
}
const files = readdirSync(dir);
const packageManager = detectPackageManager(files);
if (!files.includes("next.config.js")) {
  throw new Error("Script can only be run in root of a Next.js project.");
}
const packageJsonContents = readPackageJson(dir);
const nextVersion = getNextVersion(packageJsonContents);
const output = installDependencies(packageManager);
console.log(output);
initTailwind();
createTailwindConfig();
applyTailwindDirectives(nextVersion);
console.log(
  "Added Tailwind. If you removed the import of your global stylesheet, you may need to add it in again."
);
process.exit();
