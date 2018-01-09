/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { ITag } from "documentalist/dist/client";

export interface ITagRendererMap {
    [tagName: string]: React.SFC<ITag> | undefined;
}

export * from "./css";
export * from "./defaults";
export * from "./heading";
export * from "./interface";
export * from "./page";
export * from "./reactDocs";
export * from "./reactExample";
