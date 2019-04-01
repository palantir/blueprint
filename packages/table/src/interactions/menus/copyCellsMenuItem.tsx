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

import { IMenuItemProps, MenuItem, Utils } from "@blueprintjs/core";
import * as React from "react";

import { Clipboard } from "../../common/clipboard";
import { Regions } from "../../regions";
import { IMenuContext } from "./menuContext";

export interface ICopyCellsMenuItemProps extends IMenuItemProps {
    /**
     * The `IMenuContext` that launched the menu.
     */
    context: IMenuContext;

    /**
     * A callback that returns the data for a specific cell. This need not
     * match the value displayed in the `<Cell>` component. The value will be
     * invisibly added as `textContent` into the DOM before copying.
     */
    getCellData: (row: number, col: number) => any;

    /**
     * If you want to do something after the copy or if you want to notify the
     * user if a copy fails, you may provide this optional callback.
     *
     * Due to browser limitations, the copy can fail. This usually occurs if
     * the selection is too large, like 20,000+ cells. The copy will also fail
     * if the browser does not support the copy method (see
     * `Clipboard.isCopySupported`).
     */
    onCopy?: (success: boolean) => void;
}

export class CopyCellsMenuItem extends React.PureComponent<ICopyCellsMenuItemProps, {}> {
    public render() {
        const { context, getCellData, onCopy, ...menuItemProps } = this.props;
        return <MenuItem {...menuItemProps} onClick={this.handleClick} />;
    }

    private handleClick = () => {
        const { context, getCellData, onCopy } = this.props;
        const cells = context.getUniqueCells();
        const sparse = Regions.sparseMapCells(cells, getCellData);
        const success = Clipboard.copyCells(sparse);
        Utils.safeInvoke(onCopy, success);
    };
}
