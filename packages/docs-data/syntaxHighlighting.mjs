/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import hljs from "highlight.js/lib/core";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import less from "highlight.js/lib/languages/less";
import scss from "highlight.js/lib/languages/scss";
import typescript from "highlight.js/lib/languages/typescript";

hljs.registerLanguage("css", css);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("less", less);
hljs.registerLanguage("scss", scss);
hljs.registerLanguage("typescript", typescript);

/**
 * @param {string} source
 * @param {string | undefined} language
 */
export function highlightCodeSyntax(source, language) {
    return hljs.highlight(source, { language }).value;
}
