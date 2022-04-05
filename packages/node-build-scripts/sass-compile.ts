import fs from "fs-extra";
import path from "path";
import * as sass from "sass";
import nodeSassPackageImporter from "node-sass-package-importer";
import yargs from "yargs";

const args = yargs(process.argv.slice(2))
    .positional("input", { type: "string", description: "Input folder containing scss to compile" })
    .option("functions", {
        type: "string",
        description: "Path to file with exported custom sass functions",
    })
    .option("output", { alias: "o", type: "string", description: "Output folder" })
    .check(argv => {
        const hasOneStringArgument = argv._.length === 1 && typeof argv._[0] === "string";
        return hasOneStringArgument;
    })
    .parseSync();

const functions = args.functions != null ? require(path.resolve(args.functions)) : undefined;
const files = fs.readdirSync(args._[0]);
const inFiles = files
    .filter(file => path.extname(file) === ".scss" && !path.basename(file).startsWith("_"))
    .map(fileName => path.join(args._[0] as string, fileName));

for (const inFile of inFiles) {
    const outFile = path.join(args.output, `${path.parse(inFile).name}.css`);
    const outputMapFile = `${outFile}.map`;
    // use deprecated `renderSync` because it supports legacy importers and functions
    const result = sass.renderSync({
        file: inFile,
        importer: nodeSassPackageImporter(),
        sourceMap: true,
        outFile,
        functions,
        charset: true,
    });
    fs.outputFileSync(outFile, result.css, { flag: "w" });
    fs.outputFileSync(outputMapFile, result.map, { flag: "w" });
}
