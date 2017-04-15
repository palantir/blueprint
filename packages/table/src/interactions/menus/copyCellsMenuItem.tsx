/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IMenuItemProps, MenuItem } from "@blueprintjs/core";
import * as PureRender from "pure-render-decorator";
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

@PureRender
export class CopyCellsMenuItem extends React.Component<ICopyCellsMenuItemProps, {}> {
    public render() {
        return <MenuItem {...this.props} onClick={this.handleClick} />;
    }

    private handleClick = () => {
        const { context, getCellData, onCopy } = this.props;
        const cells = context.getUniqueCells();
        const sparse = Regions.sparseMapCells(cells, getCellData);
        const success = Clipboard.copyCells(sparse);
        if (onCopy != null) {
            onCopy(success);
        }
    }
}
