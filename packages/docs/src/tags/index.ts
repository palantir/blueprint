/*
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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
