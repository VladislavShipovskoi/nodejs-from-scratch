const http = require("http");
const readline = require("node:readline");
const { stdin, stdout } = require("process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const apiKey = process.env.API_KEY;

rl.question("Enter a city name: ", (city) => {
  const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

  http
    .get(url, (res) => {
      const { statusCode } = res;

      if (statusCode !== 200) {
        console.error(`Request failed with status code: ${statusCode}`);
        return;
      }

      res.setEncoding("utf8");
      let rawData = "";

      res.on("data", (cnunk) => {
        rawData += cnunk;
      });

      res.on("end", () => {
        console.log(JSON.parse(rawData));
      });

      console.log(`Status Code: ${res.statusCode}`);
    })
    .on("error", (e) => {
      console.error(e);
    });
  rl.close();
});
