#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const requireAtLeastOneOption = (argv) => {
  if (argv.y === undefined && argv.m === undefined && argv.d === undefined) {
    throw new Error("Error: you must pass at least one parameter");
  }
  return true;
};

const configureAdjustmentOptions = (yargsInstance) => {
  return yargsInstance
    .option("year", {
      alias: "y",
      type: "number",
      requiresArg: true,
      description: "years quantity",
    })
    .option("month", {
      alias: "m",
      type: "number",
      requiresArg: true,
      description: "months quantity",
    })
    .option("date", {
      alias: "d",
      type: "number",
      requiresArg: true,
      description: "days quantity",
    })
    .check(requireAtLeastOneOption);
};

const handleAdjustment = (args, direction) => {
  const date = new Date();

  if (args.year) {
    date.setFullYear(date.getFullYear() + args.year * direction);
  } else if (args.month) {
    date.setMonth(date.getMonth() + args.month * direction);
  } else if (args.date) {
    date.setDate(date.getDate() + args.date * direction);
  }

  console.log(date.toISOString());
};

yargs(hideBin(process.argv))
  .command(
    "current",
    "Get current date and time in ISO format",
    (args) => {
      return args
        .option("year", {
          alias: "y",
          type: "boolean",
          description: "get current year",
        })
        .option("month", {
          alias: "m",
          type: "boolean",
          description: "get current month",
        })
        .option("date", {
          alias: "d",
          type: "boolean",
          description: "get current day of the month",
        });
    },
    (args) => {
      const now = new Date();
      if (args.year) {
        console.log(now.getFullYear());
      } else if (args.month) {
        console.log(now.getMonth() + 1);
      } else if (args.date) {
        console.log(now.getDate());
      } else {
        console.log(now.toISOString());
      }
    },
  )
  .command("add", "Get date in future", configureAdjustmentOptions, (args) =>
    handleAdjustment(args, 1),
  )
  .command("sub", "Get date in past", configureAdjustmentOptions, (args) =>
    handleAdjustment(args, -1),
  )
  .demandCommand(
    1,
    1,
    "One command must be specified",
    "Only one command can be specified",
  )
  .strict()
  .help().argv;
