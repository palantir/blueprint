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

import { ICellMapper } from "./common/grid";

export interface IResizeRowsByApproximateHeightOptions {
    /**
     * Approximate width (in pixels) of an average character of text.
     */
    getApproximateCharWidth?: number | ICellMapper<number>;

    /**
     * Approximate height (in pixels) of an average line of text.
     */
    getApproximateLineHeight?: number | ICellMapper<number>;

    /**
     * Sum of horizontal paddings (in pixels) from the left __and__ right sides
     * of the cell.
     */
    getCellHorizontalPadding?: number | ICellMapper<number>;

    /**
     * Number of extra lines to add in case the calculation is imperfect.
     */
    getNumBufferLines?: number | ICellMapper<number>;
}

export interface IResizeRowsByApproximateHeightResolvedOptions {
    getApproximateCharWidth?: number;
    getApproximateLineHeight?: number;
    getCellHorizontalPadding?: number;
    getNumBufferLines?: number;
}
