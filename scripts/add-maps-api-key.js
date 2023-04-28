const fs = require("fs");
const indexFilePath = "./web-build/index.html";

try {
  fs.readFile(indexFilePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    const key = "AIzaSyB82d0m9dRBff144fQmGIIHQYYOrNdDdWQ";
    const script = `<script async defer src="https://maps.googleapis.com/maps/api/js?key=${key}" type="text/javascript"></script>`;

    const result = data.replace("</head>", `${script}</head>`);

    fs.writeFile(indexFilePath, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
  console.log("\x1b[1m%s\x1b[0m", "=== Maps ApiKey added succesfully! ===");
} catch (error) {
  console.log(error);
}
