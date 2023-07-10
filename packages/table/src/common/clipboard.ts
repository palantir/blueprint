/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

/* istanbul ignore next */

export const Clipboard = {
    /**
     * Copies table cells to the clipboard. The parameter is a row-major
     * 2-dimensional `Array` of strings and can contain nulls. We assume all
     * rows are the same length. If not, the cells will still be copied, but
     * the columns may not align.
     *
     * @returns a Promise which resolves or rejects if the copy succeeds.
     *
     * See `Clipboard.copy`
     */
    copyCells(cells: string[][]) {
        const tsv = cells.map(row => row.join("\t")).join("\n");
        return navigator.clipboard.writeText(tsv);
    },

    /**
     * Copies the text to the clipboard.
     *
     * @returns a Promise which resolves or rejects if the copy succeeds.
     */
    copyString(value: string) {
        return navigator.clipboard.writeText(value);
    },
};
