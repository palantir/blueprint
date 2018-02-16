/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { ITag } from "documentalist/dist/client";

export interface ITagRendererMap {
    [tagName: string]: React.ComponentType<ITag> | undefined;
}

export * from "./css";
export * from "./defaults";
export * from "./heading";
export * from "./reactDocs";
export * from "./reactExample";
export * from "./see";
export * from "./typescript";
