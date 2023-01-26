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

    if (language === "html" && textContent.includes("{{") && textContent.includes("}}")) {
        // special handling for one kind of handlebars expression we use in CSS APIs
        textContent = textContent.replace(
            /{{(\.|:)modifier}}/g,
            `<span class="${Classes.TAG} ${Classes.MINIMAL} ${Classes.INTENT_PRIMARY}">$1modifier</span>`,
        );
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

export { renderMarkdown, renderer as markedRenderer };
