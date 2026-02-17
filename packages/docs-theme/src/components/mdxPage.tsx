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

import { Suspense } from "react";

import { Classes, Spinner } from "@blueprintjs/core";
import type { PageRegistryEntry } from "@blueprintjs/docs-data/src/types";

export interface MdxPageProps {
    /** The page registry entry for this page. */
    page: PageRegistryEntry;

    /** Optional actions (edit link, etc.) to render in the top-right corner. */
    renderActions?: (page: PageRegistryEntry) => React.ReactNode;
}

export const MdxPage: React.FC<MdxPageProps> = ({ page, renderActions }) => {
    const PageComponent = page.component;
    return (
        <div className="docs-page" data-page-id={page.route}>
            {renderActions != null && <div className="docs-page-actions">{renderActions(page)}</div>}
            <div className={`docs-section ${Classes.RUNNING_TEXT} ${Classes.TEXT_LARGE}`}>
                <Suspense fallback={<Spinner className="docs-page-spinner" />}>
                    <PageComponent />
                </Suspense>
            </div>
        </div>
    );
};
