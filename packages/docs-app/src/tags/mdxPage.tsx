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

import type { Tag } from "@documentalist/client";

import { Classes } from "@blueprintjs/core";

// Import MDX pages
import CalloutMdx from "../docs/core/callout.mdx";

const MDX_PAGES: Record<string, React.ComponentType> = {
    callout2: CalloutMdx,
};

/**
 * Tag renderer for MDX pages. Usage in page contents:
 * { tag: "mdxPage", value: "callout2" }
 */
export const MdxPageTagRenderer: React.FC<Tag> = ({ value }) => {
    const MdxComponent = MDX_PAGES[value];

    if (MdxComponent == null) {
        return (
            <div className={Classes.CALLOUT}>
                Unknown MDX page: {value}
            </div>
        );
    }

    return (
        <div className={Classes.RUNNING_TEXT}>
            <MdxComponent />
        </div>
    );
};
