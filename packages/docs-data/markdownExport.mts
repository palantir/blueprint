/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/**
 * Replace Documentalist's `@tag value` lines with markdown-friendly placeholders so the
 * exported source can be pasted into LLM/IDE tooling without unfamiliar syntax. Lines
 * inside fenced code blocks are left untouched (Sass `@use`/`@import` etc.).
 */
export function stripDocumentalistTags(source: string): string {
    const lines = source.split("\n");
    let inFence = false;
    return lines
        .map(line => {
            if (/^\s*```/.test(line)) {
                inFence = !inFence;
                return line;
            }
            if (inFence) {
                return line;
            }
            const match = /^@(reactDocs|reactExample|interface|css)\s+(.+)$/.exec(line);
            if (match == null) {
                return line;
            }
            const [, tag, value] = match;
            const labels: Record<string, string> = {
                css: "CSS reference",
                interface: "TypeScript interface",
                reactDocs: "Interactive widget",
                reactExample: "Interactive example",
            };
            return `<!-- ${labels[tag]}: ${value.trim()} (see online docs) -->`;
        })
        .join("\n");
}
