/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IPageData, ITag } from "documentalist/dist/client";

export interface ITagRendererMap {
    [tagName: string]: TagRenderer;
}

export type TagElement = JSX.Element | undefined;

export type TagRenderer = (tag: ITag, key: React.Key, tagRenderers: ITagRendererMap, page?: IPageData) => TagElement;

export * from "./css";
export * from "./defaults";
export * from "./heading";
export * from "./interface";
export * from "./page";
export * from "./reactDocs";
export * from "./reactExample";
