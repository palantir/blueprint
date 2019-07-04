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

import * as React from "react";

import { AbstractPureComponent, IProps } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import { LoadableContent } from "../common/loadableContent";
import { HeaderCell, IHeaderCellProps } from "./headerCell";

export interface IRowHeaderCellProps extends IHeaderCellProps, IProps {
    /**
     * Specifies if the row is reorderable.
     */
    enableRowReordering?: boolean;

    /**
     * Specifies whether the full row is part of a selection.
     */
    isRowSelected?: boolean;

    /**
     * A callback to override the default name rendering behavior. The default
     * behavior is to simply use the `RowHeaderCell`s name prop.
     *
     * This render callback can be used, for example, to provide a
     * `EditableName` component for editing row names.
     *
     * The callback will also receive the row index if an `index` was originally
     * provided via props.
     */
    nameRenderer?: (name: string, index?: number) => React.ReactElement<IProps>;
}

export class RowHeaderCell extends AbstractPureComponent<IRowHeaderCellProps, {}> {
    public render() {
        const {
            // from IRowHeaderCellProps
            enableRowReordering,
            isRowSelected,
            name,
            nameRenderer,

            // from IHeaderProps
            ...spreadableProps
        } = this.props;
        const defaultName = <div className={Classes.TABLE_ROW_NAME_TEXT}>{name}</div>;

        const nameComponent = (
            <LoadableContent loading={spreadableProps.loading}>
                {nameRenderer == null ? defaultName : nameRenderer(name, spreadableProps.index)}
            </LoadableContent>
        );

        return (
            <HeaderCell
                isReorderable={this.props.enableRowReordering}
                isSelected={this.props.isRowSelected}
                {...spreadableProps}
            >
                <div className={Classes.TABLE_ROW_NAME}>{nameComponent}</div>
                {this.props.children}
                {spreadableProps.loading ? undefined : spreadableProps.resizeHandle}
            </HeaderCell>
        );
    }
}
