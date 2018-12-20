/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Code, H4, H5, H6, Pre } from "@blueprintjs/core";
import { DocPreview, theme } from "docz";
import { ComponentsMap } from "docz/dist/components/DocPreview";
import * as React from "react";

import { Documentation } from "./components/documentation";
import { Heading } from "./components/heading";
import { Loading } from "./components/loading";

const themeComponents: ComponentsMap = {
    loading: Loading,
    page: Documentation,
    h1: props => <Heading level={1} {...props} />,
    h2: props => <Heading level={2} {...props} />,
    h3: props => <Heading level={3} {...props} />,
    h4: H4,
    h5: H5,
    h6: H6,
    pre: Pre,
    inlineCode: Code,
    code: Code,
};

export const BlueprintDoczTheme: React.ComponentType<any> = theme({})(() => (
    <DocPreview components={themeComponents} />
));
