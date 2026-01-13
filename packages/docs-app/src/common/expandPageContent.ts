/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import {
    isTsClass,
    isTsInterface,
    type PageData,
    type TsClass,
    type TsInterface,
    type TypescriptPluginData,
} from "@documentalist/client";

import { interfaceSources } from "@blueprintjs/docs-data";
import type { ExampleMap } from "@blueprintjs/docs-theme";

/**
 * Expands a documentation page's raw markdown content by replacing
 * `@interface` and `@reactExample` tags with their full content.
 */
export function expandPageToMarkdown(
    page: PageData,
    typescript: TypescriptPluginData["typescript"] | undefined,
    examples: ExampleMap,
): string {
    let markdown = page.contentsRaw;

    // Expand @interface tags
    markdown = markdown.replace(/@interface (\w+)/g, (match, name) => {
        // First try to use the raw source from interfaceSources
        const rawSource = interfaceSources[name];
        if (rawSource) {
            return `\`\`\`tsx\n${rawSource}\n\`\`\``;
        }

        // Fallback to synthetic serialization if raw source not available
        const member = typescript?.[name];
        if (member == null) {
            return match;
        }
        if (isTsClass(member) || isTsInterface(member)) {
            return serializeInterfaceToMarkdown(member);
        }
        return match;
    });

    // Expand @reactExample tags
    markdown = markdown.replace(/@reactExample (\w+)/g, (match, name) => {
        const example = examples[name];
        if (example?.sourceCode == null) {
            return match;
        }
        return `\`\`\`tsx\n${example.sourceCode}\`\`\``;
    });

    // Expand @reactCodeExample tags
    markdown = markdown.replace(/@reactCodeExample (\w+)/g, (match, name) => {
        const example = examples[name];
        if (example?.sourceCode == null) {
            return match;
        }
        return `\`\`\`tsx\n${example.sourceCode}\`\`\``;
    });

    return markdown;
}

/**
 * Serializes a TypeScript interface or class to a markdown code block.
 */
function serializeInterfaceToMarkdown(data: TsInterface | TsClass): string {
    const lines: string[] = [];

    // Start code block
    lines.push("```tsx");

    // Interface/class declaration with extends
    const keyword = isTsClass(data) ? "class" : "interface";
    const ext = data.extends?.length ? ` extends ${data.extends.join(", ")}` : "";
    lines.push(`${keyword} ${data.name}${ext} {`);

    // Sort properties alphabetically
    const sortedProps = [...data.properties].sort((a, b) => a.name.localeCompare(b.name));

    // Properties
    for (const prop of sortedProps) {
        const opt = prop.flags?.isOptional ? "?" : "";
        const doc = prop.documentation?.contentsRaw?.trim();

        // Add JSDoc comment if documentation exists
        if (doc) {
            // Handle multi-line docs
            const docLines = doc.split("\n");
            if (docLines.length === 1) {
                lines.push(`    /** ${doc} */`);
            } else {
                lines.push("    /**");
                for (const line of docLines) {
                    lines.push(`     * ${line}`);
                }
                lines.push("     */");
            }
        }

        lines.push(`    ${prop.name}${opt}: ${prop.type};`);
    }

    // Methods (if any)
    const sortedMethods = [...data.methods].sort((a, b) => a.name.localeCompare(b.name));
    for (const method of sortedMethods) {
        const signature = method.signatures[0];
        if (signature) {
            const doc = signature.documentation?.contentsRaw?.trim();
            if (doc) {
                lines.push(`    /** ${doc} */`);
            }
            lines.push(`    ${method.name}: ${signature.type};`);
        }
    }

    lines.push("}");
    lines.push("```");

    return lines.join("\n");
}
