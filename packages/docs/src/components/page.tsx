/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { IPageData } from "documentalist/dist/client";
import { ITagRendererMap } from "../tags";
import { renderContentsBlock } from "./block";

export interface IPageProps {
    page: IPageData;
    tagRenderers: ITagRendererMap;
}

export const Page: React.SFC<IPageProps> = ({ tagRenderers, page }) => {
    const pageContents = renderContentsBlock(page.contents, tagRenderers, page);
    return (
        <div className="docs-page" data-page-id={page.reference}>
            {pageContents}
        </div>
    );
};
