#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const fs = require("fs");
const path = require("path");

const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("process");

const argv = yargs(hideBin(process.argv))
  .option("file", {
    alias: "f",
    type: "string",
    description: "The file to write the results to.",
  })
  .check((argv) => {
    if (!argv.file) {
      throw new Error("Please specify a file to write the results to.");
    }
    return true;
  }).argv;

async function readLogFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} not found.`);
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let wins = 0;
  let losses = 0;

  for await (const line of rl) {
    const cleanLine = line.trim();
    if (cleanLine === "true") {
      wins++;
    } else if (cleanLine === "false") {
      losses++;
    }
  }
  console.log(
    `Statistics:\nTotal games - ${wins + losses},\nWins - ${wins},\nLosses - ${losses},\nWin Rate - ${Math.floor((wins / (wins + losses)) * 100)}%`,
  );
}

const logPath = path.resolve(process.cwd(), argv.file || "logs.txt");
readLogFile(logPath).catch(console.error);
