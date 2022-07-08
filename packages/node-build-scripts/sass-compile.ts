import { watch } from "chokidar";
import fs from "fs-extra";
import path from "path";
import * as sass from "sass";
import nodeSassPackageImporter from "node-sass-package-importer";
import { RawSourceMap } from "source-map";
import yargs from "yargs";

const args = yargs(process.argv.slice(2))
    .positional("input", { type: "string", description: "Input folder containing scss to compile" })
    .option("functions", {
        type: "string",
        description: "Path to file with exported custom sass functions",
    })
    .option("output", { alias: "o", type: "string", description: "Output folder" })
    .option("watch", { alias: "w", type: "boolean", description: "Watch mode" })
    .check(argv => {
        const hasOneStringArgument = argv._.length === 1 && typeof argv._[0] === "string";
        return hasOneStringArgument;
    })
    .parseSync();

const functions = args.functions != null ? require(path.resolve(args.functions)) : undefined;

if (args.watch) {
    compileAllFiles();

    const folderToWatch = path.resolve(args._[0] as string);
    console.info(`[sass-compile] Watching ${folderToWatch} for changes...`);

    const watcher = watch([`${folderToWatch}/*.scss`, `${folderToWatch}/**/*.scss`], { persistent: true });
    watcher.on("change", fileName => {
        console.info(`[sass-compile] Detected change in ${fileName}, re-compiling.`);

        if (path.basename(fileName).startsWith("_")) {
            compileAllFiles();
        } else {
            compileFile(fileName);
        }
    });
} else {
    compileAllFiles();
}

function compileAllFiles() {
    const files = fs.readdirSync(args._[0] as string);
    const inputFiles = files
        .filter(file => path.extname(file) === ".scss" && !path.basename(file).startsWith("_"))
        .map(fileName => path.join(args._[0] as string, fileName));

    for (const inputFile of inputFiles) {
        compileFile(inputFile);
    }
    console.info("[sass-compile] Finished compiling all input .scss files.");
}

function compileFile(inputFile: string) {
    const outFile = path.join(args.output, `${path.parse(inputFile).name}.css`);
    const outputMapFile = `${outFile}.map`;
    // use deprecated `renderSync` because it supports legacy importers and functions
    const result = sass.renderSync({
        file: inputFile,
        importer: nodeSassPackageImporter(),
        sourceMap: true,
        sourceMapContents: true,
        outFile,
        functions,
        charset: true,
    });
    fs.outputFileSync(outFile, result.css, { flag: "w" });
    if (result.map != null) {
        fs.outputFileSync(outputMapFile, fixSourcePathsInSourceMap({ outputMapFile, sourceMapBuffer: result.map }), {
            flag: "w",
        });
    }
}

function fixSourcePathsInSourceMap({
    outputMapFile,
    sourceMapBuffer,
}: {
    outputMapFile: string;
    sourceMapBuffer: Buffer;
}): string {
    const parsedMap = JSON.parse(sourceMapBuffer.toString()) as RawSourceMap;
    parsedMap.sources = parsedMap.sources.map(source => {
        const outputDirectory = path.dirname(outputMapFile);
        const pathToSourceWithoutProtocol = source.replace("file://", "");
        return path.relative(outputDirectory, pathToSourceWithoutProtocol);
    });
    return JSON.stringify(parsedMap);
}
