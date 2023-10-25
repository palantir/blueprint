/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import escapeHTML from "escape-html";
import { marked } from "marked";

import { Classes } from "@blueprintjs/core";
import { Classes as DocsClasses } from "@blueprintjs/docs-theme";

/**
 * Markdown renderer with some custom logic to handle `<code>` tags.
 *
 * @see https://github.com/chjj/marked
 */
const renderer = new marked.Renderer();
/**
 * @param {string} textContent
 * @param {string | undefined} language
 * @param {boolean} isEscaped
 * @returns {string}
 */
renderer.code = (textContent, language, isEscaped) => {
    if (!isEscaped) {
        textContent = escapeHTML(textContent);
    }

    switch (language) {
        case "javascript":
        case "jsx":
        case "ts":
        case "tsx":
            language = "typescript";
            break;
    }

    const classes = [Classes.CODE_BLOCK, DocsClasses.DOCS_CODE_BLOCK].join(" ");
    return `<pre class="${classes}" data-lang="${language}">${textContent}</pre>`;
};

/**
 * Render the given markdown text as html.
 */
function renderMarkdown(textContent) {
    return marked(textContent, { renderer });
}

const hooks = {
    // HACKHACK: workaround for https://github.com/palantir/documentalist/issues/248
    // We are getting inline code snippets wrapped by newlines, which breaks the markdown rendering of multiline JSDoc
    // comments. We can work around this by removing the newlines. This should work for all practical cases since we
    // don't expect any JSDoc comment line to simply have a `code` token as its only contents.
    preprocess: md => md.replace(/\n(\`.*\`)\n/g, "$1"),
    postprocess: html => html,
};

export { hooks, renderMarkdown, renderer as markedRenderer };
