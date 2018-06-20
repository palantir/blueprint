/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import * as tags from "./";

import { ITag } from "documentalist/dist/client";

export function createDefaultRenderers(): Record<string, React.ComponentType<ITag>> {
    return {
        css: tags.CssExample,
        heading: tags.Heading,
        interface: tags.TypescriptExample,
        page: () => null,
        see: tags.SeeTag,
    };
}
