/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { editor } from "monaco-editor";

import { Colors } from "@blueprintjs/colors";
import { Classes, Utils } from "@blueprintjs/core";
import { Classes as DocsClasses } from "@blueprintjs/docs-theme";

let monacoEditor: typeof editor | undefined;

async function initializeMonaco() {
    monacoEditor = (await import(/* webpackChunkName: "monaco-editor" */ "monaco-editor")).editor;
    monacoEditor.defineTheme("blueprint-dark", MonacoThemeDark);
    monacoEditor.defineTheme("blueprint-light", MonacoThemeLight);
}

/**
 * Highlight code blocks rendered by @blueprintjs/docs-theme with the Monaco editor.
 *
 * @see https://github.com/microsoft/monaco-editor
 */
export async function highlightCodeBlocks() {
    if (monacoEditor === undefined) {
        await initializeMonaco();
    }

    const codeBlocks = document.querySelectorAll<HTMLElement>(`.${DocsClasses.DOCS_CODE_BLOCK}[data-lang]`);
    for (const block of Array.from(codeBlocks)) {
        const targetTheme = Utils.isDarkTheme(block) ? "dark" : "light";
        const colorized = block.getAttribute("data-colorized");
        if (colorized === targetTheme) {
            continue;
        } else if (colorized != null) {
            // block was already colorized with a different theme, so we must re-colorize it from the original markup
            block.innerHTML = block.getAttribute("data-original-code");
        }

        // save the original markup for later, if we have to re-colorize the theme
        block.setAttribute("data-original-code", block.innerHTML);
        monacoEditor.colorizeElement(block, {
            theme: `blueprint-${targetTheme}`,
        });
        renderKssModifiersAsTags(block);
        block.setAttribute("data-colorized", targetTheme);
    }
}

/**
 * Mutates the codeBlock element.
 *
 * @param codeBlock
 */
function renderKssModifiersAsTags(codeBlock: HTMLElement) {
    codeBlock.innerHTML = codeBlock.innerHTML.replace(
        /{{(\.|:)modifier}}/g,
        `<span class="${Classes.TAG} ${Classes.MINIMAL} ${Classes.INTENT_PRIMARY}">$1modifier</span>`,
    );
}

function token(tokenName: string, color: string) {
    return { foreground: color, token: tokenName };
}

/**
 * Dark & light themes for monaco-editor.
 *
 * @see https://microsoft.github.io/monaco-editor/playground.html#customizing-the-appearence-tokens-and-colors
 * @see https://github.com/microsoft/vscode/blob/1a58734121fed4606cbb804dc03b286fc7bb9c0a/src/vs/editor/standalone/common/themes.ts
 */

const MonacoThemeLight: editor.IStandaloneThemeData = {
    base: "vs",
    colors: {
        "editor.background": Colors.WHITE,
        "editor.foreground": Colors.DARK_GRAY1,
    },
    inherit: false,
    rules: [
        token("attribute.name", Colors.ORANGE3),
        token("attribute.value", Colors.LIME2),
        token("comment", Colors.GRAY2),
        token("delimiter", Colors.DARK_GRAY5),
        token("function", Colors.BLUE3),
        token("identifier", Colors.TURQUOISE2),
        token("keyword", Colors.VIOLET4),
        token("number", Colors.ROSE2),
        token("operator", Colors.VIOLET4),
        token("string", Colors.LIME2),
        token("tag", Colors.FOREST3),
        token("type.identifier", Colors.GOLD2),
    ],
};

const MonacoThemeDark: editor.IStandaloneThemeData = {
    base: "vs-dark",
    colors: {
        "editor.background": Colors.BLACK,
        "editor.foreground": Colors.GRAY5,
    },
    inherit: false,
    rules: [
        token("attribute.name", Colors.ORANGE4),
        token("attribute.value", Colors.LIME4),
        token("comment", Colors.GRAY2),
        token("delimiter", Colors.LIGHT_GRAY3),
        token("function", Colors.BLUE4),
        token("identifier", Colors.TURQUOISE3),
        token("keyword", Colors.VIOLET4),
        token("number", Colors.ROSE4),
        token("operator", Colors.VIOLET5),
        token("string", Colors.LIME4),
        token("tag", Colors.FOREST3),
        token("type.identifier", Colors.GOLD5),
    ],
};
