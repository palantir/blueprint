/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import type { PageNode } from "@documentalist/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { docsData } from "@blueprintjs/docs-data";
import {
    createDefaultRenderers,
    ReactCodeExampleTagRenderer,
    ReactDocsTagRenderer,
    ReactExampleTagRenderer,
} from "@blueprintjs/docs-theme";
import { Icons } from "@blueprintjs/icons";

import { BlueprintDocs } from "./components/blueprintDocs";
import { MdxPageTagRenderer } from "./tags/mdxPage";
import * as ReactDocs from "./tags/reactDocs";
import { reactExamples } from "./tags/reactExamples";

// load all icons up front so that they do not experience a flash of unstyled content (but we don't need to block on this promise)
Icons.loadAll();

const reactCodeExample = new ReactCodeExampleTagRenderer(reactExamples);
const reactDocs = new ReactDocsTagRenderer(ReactDocs as any);
const reactExample = new ReactExampleTagRenderer(reactExamples);

const tagRenderers = {
    ...createDefaultRenderers(),
    mdxPage: MdxPageTagRenderer,
    reactCodeExample: reactCodeExample.render,
    reactDocs: reactDocs.render,
    reactExample: reactExample.render,
};

// Inject MDX-based pages into the docs data
// This demonstrates how MDX pages can coexist with Documentalist pages
const docsDataWithMdx = {
    ...docsData,
    pages: {
        ...docsData.pages,
        // Add the callout2 MDX page
        callout2: {
            reference: "callout2",
            route: "core/components/callout2",
            title: "Callout (MDX)",
            metadata: {},
            contents: [{ tag: "mdxPage", value: "callout2" }],
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nav: docsData.nav.map((section: any) => {
        if (section.reference === "core") {
            return {
                ...section,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                children: section.children?.map((child: any) => {
                    if (child.reference === "components") {
                        // Add callout2 to the components navigation, right after callout
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const calloutIndex = child.children?.findIndex((c: any) => c.reference === "callout");
                        const newChildren = [...(child.children ?? [])];
                        const callout2NavItem: PageNode = {
                            reference: "callout2",
                            route: "core/components/callout2",
                            title: "Callout (MDX)",
                            level: 2,
                            children: [],
                        };
                        if (calloutIndex !== undefined && calloutIndex !== -1) {
                            newChildren.splice(calloutIndex + 1, 0, callout2NavItem);
                        }
                        return { ...child, children: newChildren };
                    }
                    return child;
                }),
            };
        }
        return section;
    }),
};

const container = document.getElementById("blueprint-documentation");
const root = createRoot(container);
root.render(
    <StrictMode>
        <BlueprintDocs
            defaultPageId="blueprint"
            docs={docsDataWithMdx}
            tagRenderers={tagRenderers}
            useNextVersion={false}
        />
    </StrictMode>,
);
