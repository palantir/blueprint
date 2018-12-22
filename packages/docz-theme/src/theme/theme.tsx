/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { DocPreview, theme } from "docz";
import { ComponentsMap } from "docz/dist/components/DocPreview";
import * as React from "react";

import { Documentation } from "./components/documentation";
import { Heading } from "./components/heading";
import { Loading } from "./components/loading";

const themeComponents: ComponentsMap = {
    h1: props => <Heading level={1} {...props} />,
    h2: props => <Heading level={2} {...props} />,
    h3: props => <Heading level={3} {...props} />,
    h4: props => <Heading level={4} {...props} />,
    h5: props => <Heading level={5} {...props} />,
    h6: props => <Heading level={6} {...props} />,
    loading: Loading,
    page: Documentation,
};

export const BlueprintDoczTheme: React.ComponentType<any> = theme({})(() => (
    <DocPreview components={themeComponents} />
));
