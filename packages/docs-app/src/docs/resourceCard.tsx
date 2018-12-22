/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

export const ResourceCard: React.SFC<{ name: string; lastUpdated: string }> = ({ name, lastUpdated }) => (
    <a className={classes} href={`${GITHUB_URL}/${name}`} target="_blank">
        <span>{name}</span>
        <small>Last updated {lastUpdated}</small>
    </a>
);

// not using <Card> because this must be a link.
const classes = classNames(Classes.CARD, Classes.INTERACTIVE, "blueprint-resource");

const GITHUB_URL = "https://github.com/palantir/blueprint/tree/develop/resources/sketch";
