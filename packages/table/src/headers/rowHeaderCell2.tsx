/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent2 } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import { LoadableContent } from "../common/loadableContent";
import { HeaderCell2 } from "./headerCell2";
import type { RowHeaderCellProps } from "./rowHeaderCell";

/**
 * Row header cell (v2) component.
 *
 * @see https://blueprintjs.com/docs/#table/api.rowheadercell2
 */
export class RowHeaderCell2 extends AbstractPureComponent2<RowHeaderCellProps> {
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
            <LoadableContent loading={spreadableProps.loading ?? false}>
                {nameRenderer?.(name!, spreadableProps.index) ?? defaultName}
            </LoadableContent>
        );

        return (
            <HeaderCell2
                isReorderable={this.props.enableRowReordering}
                isSelected={this.props.isRowSelected}
                {...spreadableProps}
            >
                <div className={Classes.TABLE_ROW_NAME}>{nameComponent}</div>
                {this.props.children}
                {spreadableProps.loading ? undefined : spreadableProps.resizeHandle}
            </HeaderCell2>
        );
    }
}
