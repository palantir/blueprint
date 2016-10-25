/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

var fs = require("fs");
var marked = require("marked");
var Highlights = require("highlights");
var strSource = require("vinyl-source-stream");

var DEFAULT_SCOPE = "source.tsx";

const COPYRIGHT_HEADER = "\/*\n * Copyright 2015-present Palantir Technologies, Inc. All rights reserved.\n *\/\n";

// Highlights configuration (https://github.com/atom/highlights)

var highlighter = new Highlights();
// a few additional languages... highlights comes with a basic set.
["better-handlebars", "language-typescript", "language-less"].forEach((pkg) => {
    highlighter.requireGrammarsSync({ modulePath: require.resolve(`${pkg}/package.json`) });
});

// highlights the given text in the given language scope. returns HTML string wrapped in <pre> tag.
// must provide full TextMate language scope: "text.html.basic"
function highlight(textContent, scopeName) {
    if (textContent) {
        return highlighter.highlightSync({
            fileContents: textContent,
            scopeName: scopeName ? scopeName : DEFAULT_SCOPE,
        });
    }
}

// Marked configuration (https://github.com/chjj/marked)

// custom renderer lets us change tag semantics
var renderer = new marked.Renderer();
renderer.code = (textContent, language) => {
    // massage markdown language hint into TM language scope
    if (language === "html") {
        language = "text.html.basic";
    } else if (language != null && !/^source\./.test(language)) {
        language = `source.${language}`;
    }
    // highlights returns HTML already wrapped in a <pre> tag
    return highlight(textContent, language);
};

module.exports = {
    COPYRIGHT_HEADER,

    highlight: highlight,

    // render the given text as markdown, using the custom rendering logic above.
    // code blocks are highlighted using highlight() above.
    markdown: (textContent) => marked(textContent, { renderer }),

    // synchronously read and return string content of file.
    fromFile: (filepath) => fs.readFileSync(filepath, "utf8"),

    // return a vinyl-source-stream with the given filename and write the contents to it.
    fileStream: (filename, contents) => {
        const stream = strSource(filename);
        stream.end(contents);
        return stream;
    },
};
