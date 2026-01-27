import * as docgen from "react-docgen-typescript";
import * as fs from "fs";
import * as path from "path";

const parser = docgen.withCustomConfig(path.resolve("packages/core/src/tsconfig.json"), {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    propFilter: prop => {
        // Filter out inherited HTML props unless explicitly documented
        if (prop.declarations !== undefined && prop.declarations.length > 0) {
            const hasPropAdditionalDescription = prop.declarations.find(declaration => {
                return !declaration.fileName.includes("node_modules");
            });
            return Boolean(hasPropAdditionalDescription);
        }
        return true;
    },
});

const componentFile = path.resolve("packages/core/src/components/callout/callout.tsx");
const docs = parser.parse(componentFile);

const outputPath = path.join(path.dirname(componentFile), "callout-props.json");
fs.writeFileSync(outputPath, JSON.stringify(docs, null, 2));

console.log(`Wrote props to ${outputPath}`);
console.log(`Found ${docs.length} component(s)`);
