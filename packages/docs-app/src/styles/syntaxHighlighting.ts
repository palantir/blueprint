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

import { Classes, Utils } from "@blueprintjs/core";
import { Classes as DocsClasses } from "@blueprintjs/docs-theme";
import { MonacoThemeDark, MonacoThemeLight } from "@blueprintjs/monaco-editor-theme";

let monacoEditor: typeof editor | undefined;

async function initializeMonaco() {
    monacoEditor = (await import(/* webpackChunkName: "monaco-editor" */ "monaco-editor")).editor;
    monacoEditor.defineTheme("blueprint-dark", MonacoThemeDark);
    monacoEditor.defineTheme("blueprint-light", MonacoThemeLight);
}

/**
 * Highlight code blocks rendered by @blueprintjs/docs-theme with the Monaco editor.
 *
 * TODO(adahiya): move this to @blueprintjs/docs-theme in v5.0, once we can switch tsc "module" option to "es2020"
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

    // Set up copy-to-clipboard functionality
    setupCopyToClipboard();
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

/**
 * Sets up copy-to-clipboard functionality for code blocks.
 */
function setupCopyToClipboard() {
    const copyButtons = document.querySelectorAll<HTMLButtonElement>(".docs-copy-button");
    
    copyButtons.forEach(button => {
        // Remove existing event listeners to prevent duplicates
        button.removeEventListener("click", handleCopyClick);
        button.addEventListener("click", handleCopyClick);
    });
}

/**
 * Handles copy button click events.
 *
 * @param event The click event
 */
async function handleCopyClick(event: Event) {
    const button = event.currentTarget as HTMLButtonElement;
    const codeContent = button.getAttribute("data-code-content");
    
    if (!codeContent) {
        console.warn("No code content found for copy button");
        return;
    }

    try {
        // Use the modern clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(codeContent);
        } else {
            // Fallback for older browsers or non-secure contexts
            const textArea = document.createElement("textarea");
            textArea.value = codeContent;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }

        // Show success state
        button.classList.add("docs-copy-button-copied");
        const textElement = button.querySelector(".docs-copy-button-text");
        if (textElement) {
            textElement.textContent = "Copied!";
        }

        // Reset after 2 seconds
        setTimeout(() => {
            button.classList.remove("docs-copy-button-copied");
            if (textElement) {
                textElement.textContent = "Copy";
            }
        }, 2000);

    } catch (error) {
        console.error("Failed to copy code to clipboard:", error);
        
        // Show error state briefly
        button.style.background = "#ff6b6b";
        button.style.color = "white";
        
        setTimeout(() => {
            button.style.background = "";
            button.style.color = "";
        }, 2000);
    }
}
