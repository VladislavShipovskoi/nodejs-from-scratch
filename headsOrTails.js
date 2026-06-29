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

const file = path.resolve(process.cwd(), argv.file || "logs.txt");

async function startGame() {
  const writeStream = fs.createWriteStream(file, {
    flags: "a",
    encoding: "utf-8",
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function closeGame() {
    console.log("\nYou have exited the game. Saving results...");
    rl.close();
    writeStream.end();
  }

  rl.on("SIGINT", () => {
    closeGame();
  });

  writeStream.on("finish", () => {
    process.exit(0);
  });

  const results = {
    0: "head",
    1: "tail",
  };

  let gamesCount = 1;

  while (true) {
    const targetNumber = Math.round(Math.random());

    const answer = await rl.question(
      `Game #${gamesCount}. Your choice - head (0) or tail (1): `,
    );

    const trimmedAnswer = answer.trim().toLowerCase();

    const userAnswer = parseInt(trimmedAnswer, 10);

    if (isNaN(userAnswer) || (userAnswer !== 0 && userAnswer !== 1)) {
      console.log("Please enter 0 or 1. \n");
      continue;
    }

    gamesCount++;

    if (userAnswer === targetNumber) {
      writeStream.write("true\n", "utf-8");
      console.log(`You guessed it! It came up: ${results[targetNumber]}.\n`);
    } else {
      writeStream.write("false\n", "utf-8");
      console.log(`You guessed wrong! It came up: ${results[targetNumber]}.\n`);
    }
  }
}

startGame().catch((err) => {
  console.error("Something went wrong:", err);
  process.exit(1);
});
