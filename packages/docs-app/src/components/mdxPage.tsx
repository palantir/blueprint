/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { MDXProvider } from "@mdx-js/react";

import { Classes } from "@blueprintjs/core";

import { mdxComponents } from "./mdxComponents";

export interface MdxPageProps {
    /** The compiled MDX component to render. */
    Content: React.ComponentType;
    /** Page route ID used as a data attribute for scroll spy / routing. */
    pageId: string;
}

export const MdxPage: React.FC<MdxPageProps> = ({ Content, pageId }) => {
    return (
        <div className="docs-page" data-page-id={pageId}>
            <div className="docs-section">
                <div className={`${Classes.RUNNING_TEXT} ${Classes.TEXT_LARGE}`}>
                    <MDXProvider components={mdxComponents}>
                        <Content />
                    </MDXProvider>
                </div>
            </div>
        </div>
    );
};
