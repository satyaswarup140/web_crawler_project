const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Web Crawler is running. Visit /results to view the output.");
});

app.get("/results", (req, res) => {
  const resultsPath = path.resolve(__dirname, "../output/results.json");
  if (fs.existsSync(resultsPath)) {
    const results = fs.readFileSync(resultsPath, "utf-8");
    res.json(JSON.parse(results));
  } else {
    res.status(404).send("Results not found.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
