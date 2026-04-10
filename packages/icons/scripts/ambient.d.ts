/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0.
 */

declare module "@blueprintjs/node-build-scripts" {
    export const svgOptimizer: {
        optimize(svg: string, config?: { path?: string }): Promise<{ data: string }>;
    };
}

declare module "svg-parser" {
    /** Loose tree shape sufficient for walking glyph nodes from an SVG font document */
    export interface SvgParserNode {
        type?: string;
        tagName?: string;
        properties?: Record<string, string | undefined>;
        children?: SvgParserNode[];
    }

    export function parse(svg: string): SvgParserNode;
}
