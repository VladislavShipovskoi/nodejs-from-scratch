#!/usr/bin/env node

const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const minVal = 0;
const maxVal = 100;

const randomNumber = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const targetNumber = randomNumber();

rl.write(`Загадано число в диапазоне от ${minVal} до ${maxVal}\n`);

rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  const guess = parseInt(trimmed, 10);

  if (isNaN(guess)) {
    console.log("Пожалуйста, введите корректное целое число.");
    return;
  }

  if (guess < targetNumber) {
    console.log("Больше");
  } else if (guess > targetNumber) {
    console.log("Меньше");
  } else {
    console.log(`Отгадано число ${targetNumber}`);
    rl.close();
  }
});
