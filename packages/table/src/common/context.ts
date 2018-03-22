/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as PropTypes from "prop-types";
import * as React from "react";

export interface IColumnInteractionBarContextTypes {
    enableColumnInteractionBar: boolean;
}

export const columnInteractionBarContextTypes: React.ValidationMap<IColumnInteractionBarContextTypes> = {
    enableColumnInteractionBar: PropTypes.bool,
};
