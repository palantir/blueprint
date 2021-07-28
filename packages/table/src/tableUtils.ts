/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { Utils } from "./common/utils";
import type { TableProps } from "./tableProps";

export function clampNumFrozenColumns(props: TableProps) {
    const { numFrozenColumns } = props;
    const numColumns = React.Children.count(props.children);
    return clampPotentiallyNullValue(numFrozenColumns, numColumns);
}

export function clampNumFrozenRows(props: TableProps) {
    const { numFrozenRows, numRows } = props;
    return clampPotentiallyNullValue(numFrozenRows, numRows);
}

// add explicit `| null | undefined`, because the params make more sense in this
// order, and you can't have an optional param precede a required param.
function clampPotentiallyNullValue(value: number | null | undefined, max: number) {
    return value == null ? 0 : Utils.clamp(value, 0, max);
}

export function hasLoadingOption(loadingOptions: string[], loadingOption: string) {
    if (loadingOptions == null) {
        return undefined;
    }
    return loadingOptions.indexOf(loadingOption) >= 0;
}
