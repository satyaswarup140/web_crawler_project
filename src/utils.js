const fs = require("fs");

function saveResults(data, filePath = "output/results.json") {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function isValidProductURL(url) {
  return url.includes("/product") || url.includes("/item") || url.includes("/p/");
}

module.exports = { saveResults, isValidProductURL };
