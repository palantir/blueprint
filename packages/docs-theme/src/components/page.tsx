/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes } from "@blueprintjs/core";
import { IPageData } from "documentalist/dist/client";
import { ITagRendererMap } from "../tags";
import { renderBlock } from "./block";

export interface IPageProps {
    page: IPageData;
    renderActions: (page: IPageData) => React.ReactNode;
    tagRenderers: ITagRendererMap;
}

export const Page: React.SFC<IPageProps> = ({ page, renderActions, tagRenderers }) => {
    // apply running text styles to blocks in pages (but not on blocks in examples)
    const pageContents = renderBlock(page, tagRenderers, Classes.TEXT_LARGE);
    return (
        <div className="docs-page" data-page-id={page.route}>
            {renderActions && <div className="docs-page-actions">{renderActions(page)}</div>}
            {pageContents}
        </div>
    );
};
