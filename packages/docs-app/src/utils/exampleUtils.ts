/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { createElement } from "react";

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

/**
 * Interface for example imports
 */
export interface ExampleConfig {
    Component: React.ComponentType<any>;
    previewCode: string;
    sourceCode: string;
    sourceUrl: string;
}

/**
 * Creates an example component from imports
 */
export function createExample(name: string, config: ExampleConfig): React.FC<ExampleProps> {
    const { Component, previewCode, sourceCode, sourceUrl } = config;

    const ExampleComponent = (props: ExampleProps) => {
        return createElement(CodeExample, { previewCode, sourceCode, sourceUrl, ...props }, createElement(Component));
    };

    ExampleComponent.displayName = `${name}Example`;
    return ExampleComponent;
}

/**
 * Creates multiple examples from a record of imports
 */
export function createExamples(configRecord: Record<string, ExampleConfig>): Record<string, React.FC<ExampleProps>> {
    const examples: Record<string, React.FC<ExampleProps>> = {};

    Object.entries(configRecord).forEach(([name, config]) => {
        const exampleKey = `${name}Example`;
        examples[exampleKey] = createExample(name, config);
    });

    return examples;
}

/**
 * Helper macro for creating example config object
 */
export function buildConfig(
    Component: React.ComponentType<any>,
    previewCode: string,
    sourceCode: string,
    basePath: string,
): ExampleConfig {
    const componentName = Component.displayName || Component.name;
    const sourceUrl = generateGitHubUrlFromBasePath(basePath, componentName);

    return {
        Component,
        previewCode,
        sourceCode,
        sourceUrl,
    };
}

/**
 * Generate GitHub URL from a base path and component name
 */
function generateGitHubUrlFromBasePath(basePath: string, componentName: string): string {
    // Use develop branch as default - this could be made configurable
    const branch = "develop";
    const fileName = `${componentName}.tsx`;

    // Convert the basePath to a GitHub path
    // Remove any leading/trailing slashes and ensure it's relative to the repo root
    const cleanBasePath = basePath.replace(/^\/+|\/+$/g, "");

    return `https://github.com/palantir/blueprint/tree/${branch}/${cleanBasePath}/${fileName}`;
}

/**
 * Helper function to create a base path for GitHub URLs
 * Usage: const basePath = createBasePath(import.meta.url);
 */
export function createBasePath(importMetaUrl: string): string {
    // Extract the path from import.meta.url and convert to GitHub path
    const url = new URL(importMetaUrl);
    const pathname = url.pathname;

    // Find the position of 'packages/docs-app/src/examples'
    const examplesIndex = pathname.indexOf("/packages/docs-app/src/examples/");
    if (examplesIndex === -1) {
        throw new Error("Could not determine base path");
    }

    // Extract the path from 'packages' onwards and remove the filename
    const fullPath = pathname.substring(examplesIndex + 1); // Remove leading slash
    const pathParts = fullPath.split("/");
    pathParts.pop(); // Remove the filename (index.tsx)

    return pathParts.join("/");
}
