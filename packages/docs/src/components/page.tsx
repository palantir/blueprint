/*
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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
    return <div className="docs-page" data-page-id={page.reference}>{pageContents}</div>;
};
