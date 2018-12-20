/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * 
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { NonIdealState, Spinner } from "@blueprintjs/core";
import React from "react";

export const Loading: React.SFC = () => (
    <NonIdealState icon={<Spinner size={Spinner.SIZE_LARGE} intent="primary" />} title="Loading..." />
);
