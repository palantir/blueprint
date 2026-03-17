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
 * @param {string | undefined} infostring
 * @param {boolean} isEscaped
 * @returns {string}
 */
renderer.code = (textContent, infostring, isEscaped) => {
    if (!isEscaped) {
        textContent = escapeHTML(textContent);
    }

    // Parse the info string: first token is language, remaining tokens are metadata flags.
    // e.g. "tsx copy" → language = "tsx", hasCopyTag = true
    const tokens = (infostring || "").split(/\s+/).filter(Boolean);
    let language = tokens[0] || "";
    const hasCopyTag = tokens.includes("copy");

    switch (language) {
        case "javascript":
        case "jsx":
        case "ts":
        case "tsx":
            language = "typescript";
            break;
    }

    const pre = `<pre class="${Classes.CODE_BLOCK} ${DocsClasses.DOCS_CODE_BLOCK}" data-lang="${language}">${textContent}</pre>`;

    // Wrap code blocks in a container so the docs app can mount a copy button.
    // Triggered by either an explicit `copy` tag in the info string, or code starting with "import ".
    if (hasCopyTag) {
        return `<div class="docs-copyable-import">${pre}</div>`;
    }

    return pre;
};

/**
 * Render the given markdown text as html.
 */
function renderMarkdown(textContent) {
    return marked(textContent, { renderer });
}

const hooks = {
    /**
     * @param md {string}
     * @returns {string}
     */
    preprocess: md => {
        // HACKHACK: workaround for https://github.com/palantir/documentalist/issues/248
        // As of Documentalist v5.0.0 & TypeDoc v0.25, we are getting inline code snippets wrapped by newlines, which
        // breaks the markdown rendering of multiline JSDoc comments. We can work around this by removing the newlines.
        // This should work for all practical cases since we don't expect any JSDoc comment line to simply have a `code`
        // token as its only contents. N.B. we must take care to avoid matching triple-backtick fenced code blocks (hence
        // the negative look-ahead).
        return md.replace(/\n(\`(?!\`).*\`)\n/g, "$1");
    },

    /**
     * @param html {string}
     * @returns {string}
     */
    postprocess: html => html,
};

export { hooks, renderMarkdown, renderer as markedRenderer };
