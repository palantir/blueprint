/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { withDocumentalist } from "../common/context";
import { CssExample as CssExampleCmp } from "./css";
import { Interface as InterfaceCmp } from "./interface";

export const CssExample = withDocumentalist(CssExampleCmp);
export const Interface = withDocumentalist(InterfaceCmp);

export * from "./example";
