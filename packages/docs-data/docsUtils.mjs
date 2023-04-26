/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import Highlights from "highlights";
import { marked } from "marked";
import { createRequire } from "module";

const DEFAULT_SCOPE = "source.tsx";
const HIGHLIGHTS_LANGUAGES = ["better-handlebars", "language-less", "tree-sitter-typescript"];

// import.meta.resolve is still experimental under a CLI flag, so we create a require fn instead
// see https://nodejs.org/docs/latest-v16.x/api/esm.html#importmetaresolvespecifier-parent
const require = createRequire(import.meta.url);

// Highlights configuration (https://github.com/atom/highlights)
const highlighter = new Highlights();
// add a few additional languages... highlights comes with a basic set.
for (const lang of HIGHLIGHTS_LANGUAGES) {
    highlighter.requireGrammarsSync({ modulePath: require.resolve(`${lang}/package.json`) });
}

// highlights the given text in the given language scope. returns HTML string wrapped in <pre> tag.
// must provide full TextMate language scope: "text.html.basic"
export function highlight(fileContents, scopeName = DEFAULT_SCOPE) {
    if (fileContents) {
        return highlighter.highlightSync({ fileContents, scopeName });
    }
}

// Marked configuration (https://github.com/chjj/marked)

// custom renderer lets us change tag semantics
const renderer = new marked.Renderer();
renderer.code = (textContent, language) => {
    // massage markdown language hint into TM language scope
    if (language === "html") {
        language = "text.html.handlebars";
    } else if (language != null && !/^source\./.test(language)) {
        language = `source.${language}`;
    }
    // highlights returns HTML already wrapped in a <pre> tag
    return highlight(textContent, language);
};

// render the given text as markdown, using the custom rendering logic above.
// code blocks are highlighted using highlight() above.
const markdown = textContent => marked(textContent, { renderer });

export { markdown, renderer as markedRenderer };
