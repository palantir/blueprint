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

import { createContext, createElement, useContext } from "react";

import { Code } from "@blueprintjs/core";
import type { TagRendererMap } from "@blueprintjs/docs-theme";

export const TagRendererContext = createContext<TagRendererMap>({});

export interface BlueprintTagProps {
    tag: string;
    value: string;
}

/**
 * Runtime bridge between MDX `@tag value` syntax and the existing tag renderer infrastructure.
 * The remark-blueprint-tags plugin transforms `@tag value` paragraphs into
 * `<BlueprintTag tag="..." value="..." />` JSX elements.
 */
export const BlueprintTag: React.FC<BlueprintTagProps> = ({ tag, value }) => {
    const tagRenderers = useContext(TagRendererContext);
    const renderer = tagRenderers[tag];
    if (renderer == null) {
        return (
            <Code>
                Unknown @tag: @{tag} {value}
            </Code>
        );
    }
    return createElement(renderer, { tag, value });
};
