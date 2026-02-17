/**
 * Migrates documentation .md files to .mdx format by replacing Documentalist
 * @tag syntax with standard markdown headings and JSX components.
 *
 * Usage: node scripts/migrate-md-to-mdx.mjs [--dry-run]
 */

import { globSync, readFileSync, writeFileSync, renameSync } from "fs";
import { resolve, relative } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run");

// Counters for summary
const counts = {
    heading: 0,
    reactCodeExample: 0,
    reactExample: 0,
    reactDocs: 0,
    interface: 0,
    method: 0,
    css: 0,
    ns: 0,
    filesRenamed: 0,
};

const GLOB_PATTERNS = [
    "packages/core/src/**/*.md",
    "packages/datetime/src/**/*.md",
    "packages/select/src/**/*.md",
    "packages/table/src/**/*.md",
    "packages/icons/src/**/*.md",
    "packages/labs/src/**/*.md",
    "packages/docs-app/src/**/*.md",
];

const EXCLUDED_BASENAMES = new Set(["_nav.md", "CHANGELOG.md", "README.md"]);

// Find all target files
const files = GLOB_PATTERNS.flatMap(pattern =>
    globSync(resolve(ROOT, pattern), { exclude: p => p.name === "node_modules" || EXCLUDED_BASENAMES.has(p.name) }),
).map(p => (typeof p === "string" ? p : p.toString()));

console.log(`Found ${files.length} .md files to process${DRY_RUN ? " (dry run)" : ""}\n`);

for (const filePath of files) {
    const rel = relative(ROOT, filePath);
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    let inCodeFence = false;
    const transformed = [];

    for (let line of lines) {
        // Track code fence boundaries
        if (/^```/.test(line)) {
            inCodeFence = !inCodeFence;
        }

        // Always replace @ns- (even inside code fences, matching Documentalist behavior)
        const nsMatches = (line.match(/@ns-/g) || []).length;
        if (nsMatches > 0) {
            line = line.replace(/@ns-/g, "bp6-");
            counts.ns += nsMatches;
        }

        // Skip tag transformations inside code fences
        if (inCodeFence) {
            transformed.push(line);
            continue;
        }

        // Headings: @# -> #, @## -> ##, etc.
        if (/^@(#{1,6})\s/.test(line)) {
            line = line.replace(/^@(#{1,6})\s/, "$1 ");
            counts.heading++;
        }
        // @reactCodeExample Name -> <Name />
        else if (/^@reactCodeExample\s+(\S+)\s*$/.test(line)) {
            line = line.replace(/^@reactCodeExample\s+(\S+)\s*$/, "<$1 />");
            counts.reactCodeExample++;
        }
        // @reactExample Name -> <Name />
        else if (/^@reactExample\s+(\S+)\s*$/.test(line)) {
            line = line.replace(/^@reactExample\s+(\S+)\s*$/, "<$1 />");
            counts.reactExample++;
        }
        // @reactDocs Name -> <Name />
        else if (/^@reactDocs\s+(\S+)\s*$/.test(line)) {
            line = line.replace(/^@reactDocs\s+(\S+)\s*$/, "<$1 />");
            counts.reactDocs++;
        }
        // @interface Name -> <InterfaceTable name="Name" />
        else if (/^@interface\s+(\S+)\s*$/.test(line)) {
            line = line.replace(/^@interface\s+(\S+)\s*$/, '<InterfaceTable name="$1" />');
            counts.interface++;
        }
        // @method Name -> <MethodTable name="Name" />
        else if (/^@method\s+(\S+)\s*$/.test(line)) {
            line = line.replace(/^@method\s+(\S+)\s*$/, '<MethodTable name="$1" />');
            counts.method++;
        }
        // @css reference -> <CssExample reference="reference" />
        else if (/^@css\s+(\S+)\s*$/.test(line)) {
            line = line.replace(/^@css\s+(\S+)\s*$/, '<CssExample reference="$1" />');
            counts.css++;
        }

        transformed.push(line);
    }

    const newContent = transformed.join("\n");
    const mdxPath = filePath.replace(/\.md$/, ".mdx");

    if (DRY_RUN) {
        if (content !== newContent) {
            console.log(`  [would transform] ${rel}`);
        }
        console.log(`  [would rename]    ${rel} -> ${relative(ROOT, mdxPath)}`);
    } else {
        writeFileSync(filePath, newContent, "utf-8");
        renameSync(filePath, mdxPath);
        console.log(`  converted: ${rel} -> ${relative(ROOT, mdxPath)}`);
    }
    counts.filesRenamed++;
}

console.log("\n--- Summary ---");
console.log(`Files renamed:        ${counts.filesRenamed}`);
console.log(`Headings (@#):        ${counts.heading}`);
console.log(`@reactCodeExample:    ${counts.reactCodeExample}`);
console.log(`@reactExample:        ${counts.reactExample}`);
console.log(`@reactDocs:           ${counts.reactDocs}`);
console.log(`@interface:           ${counts.interface}`);
console.log(`@method:              ${counts.method}`);
console.log(`@css:                 ${counts.css}`);
console.log(`@ns- replacements:    ${counts.ns}`);
console.log(`\nTotal tag transforms: ${counts.heading + counts.reactCodeExample + counts.reactExample + counts.reactDocs + counts.interface + counts.method + counts.css}`);
if (DRY_RUN) {
    console.log("\n(Dry run - no files were modified)");
}
