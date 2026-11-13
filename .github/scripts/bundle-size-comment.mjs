/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// Renders the size-limit comparison table for a PR.
//
//   node bundle-size-comment.mjs <current.json> <base.json> [<measured sha>]
//
// Both inputs are `size-limit --json` output. Either may be missing or garbage
// (the measurement steps tolerate failure), so treat an unreadable file as an
// empty result set rather than crashing the job. On failure size-limit writes
// `{ "error": <stack> }` instead of an array; that is surfaced in the comment.

import { readFileSync } from "node:fs";

const [currentPath, basePath, sha] = process.argv.slice(2);

const errors = [];

function readSizes(path, label) {
    try {
        const parsed = JSON.parse(readFileSync(path, "utf8"));
        if (Array.isArray(parsed)) return parsed;
        if (parsed?.error) {
            errors.push(`${label}: ${String(parsed.error).split("\n")[0]}`);
        }
    } catch {
        // Unreadable or not JSON: treat as no measurements.
    }
    return [];
}

function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const units = ["B", "kB", "MB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2) + " " + units[i];
}

function formatChange(current, base) {
    if (base === 0) return current === 0 ? "0%" : "new";
    const pct = ((current - base) / base) * 100;
    if (Math.abs(pct) < 0.01) return "0%";
    return `${pct > 0 ? "+" : ""}${pct.toFixed(2)}%${pct > 0 ? " 🔺" : " 🔽"}`;
}

const current = readSizes(currentPath, "this PR");
const base = readSizes(basePath, "base branch");

const currentMap = Object.fromEntries(current.map(e => [e.name, e.size]));
const baseMap = Object.fromEntries(base.map(e => [e.name, e.size]));
const names = [...new Set([...base.map(e => e.name), ...current.map(e => e.name)])];

const lines = [
    "## size-limit report 📦",
    "",
    // A bare SHA is auto-linked by GitHub; it shows when the comment is stale after a failed run.
    ...(sha ? [`Measured at ${sha}.`, ""] : []),
    "Brotli-compressed JS from bundling each entry with [Rolldown](https://rolldown.rs) (Vite 8's bundler), counting only what loads up front. React and other `@blueprintjs/*` packages are excluded.",
    "",
];

if (names.length === 0) {
    lines.push("size-limit produced no measurements for either side of this comparison.");
} else {
    const rows = names.map(name => {
        const cur = currentMap[name] ?? 0;
        const change = formatChange(cur, baseMap[name] ?? 0);
        return { change, row: `| \`${name}\` | ${formatBytes(cur)} | ${change} |` };
    });
    const header = ["| Path | Size | Change |", "|------|------|--------|"];
    // Changes that round to 0% count as unchanged, so byte-level noise stays out of the summary.
    const changed = rows.filter(r => r.change !== "0%");
    const unchanged = rows.length - changed.length;

    if (changed.length === 0) {
        lines.push(`No size changes across ${unchanged} entries.`);
    } else {
        lines.push(...header, ...changed.map(r => r.row));
        if (unchanged > 0) {
            lines.push("", `${unchanged} unchanged.`);
        }
    }
    // The blank lines around the table are needed for GitHub to render markdown inside <details>.
    lines.push("", "<details><summary>All entries</summary>", "", ...header, ...rows.map(r => r.row), "", "</details>");
}

for (const error of errors) {
    lines.push("", `size-limit failed for ${error}`);
}

process.stdout.write(lines.join("\n") + "\n");
