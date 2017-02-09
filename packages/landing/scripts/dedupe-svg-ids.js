var fs = require("fs");
var path = require("path");

function rewriteIds(contents, id) {
  return contents
      .replace(/\bhref="#/g, `href="#${id}-`)
      .replace(/url\(#/g, `url(#${id}-`)
      .replace(/\bid="/g, `id="${id}-`);
}

var svgs = require("../src/svgs.json");
svgs.forEach(function(svg) {
    var filePath = path.join(__dirname, "..", "src/resources/inline", svg + ".svg");
    // tslint:disable-next-line:no-console
    console.log("Rewriting IDs:", filePath);
    fs.writeFileSync(filePath, rewriteIds(fs.readFileSync(filePath, "UTF8"), svg));
});
