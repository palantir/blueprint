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

import classNames from "classnames";
import * as React from "react";

import { Button, Classes as CoreClasses, Menu, MenuItem, Popover } from "@blueprintjs/core";

import {
    BUTTON_LINK,
    LISTOGRAM_DRAWER,
    LISTOGRAM_SELECTION_CLEAR_ALL,
    LISTOGRAM_SELECTION_DRAWER,
    LISTOGRAM_SELECTION_MODE,
    LISTOGRAM_SELECTION_MODE_BUTTON,
    LISTOGRAM_SELECTION_MODE_POPOVER,
} from "./listogramClasses";
import type { ListogramSelectionProps } from "./listogramSelectionUtils";
import { type ListogramFormatter, ListogramSelectionMode } from "./listogramTypes";

export interface ListogramSelectionDrawerProps extends ListogramSelectionProps {
    formatters?: ListogramFormatter;
}

export const ListogramSelectionDrawer = ({
    formatters = {},
    labels = {},
    selectionMode,
    numSelectedItems,
    numTotalItems,
    onClearSelection,
    onSelectionModeChange,
}: ListogramSelectionDrawerProps) => {
    const { formatSelectionSummary = defaultFormatSelectionSummary } = formatters;
    const {
        excluding: excludingText = capitalize(ListogramSelectionMode.EXCLUDING),
        keeping: keepingText = capitalize(ListogramSelectionMode.KEEPING),
    } = labels;

    const getItemClickHandler = React.useCallback(
        (mode: ListogramSelectionMode) => {
            return () => onSelectionModeChange?.(mode);
        },
        [onSelectionModeChange],
    );

    const selectionModeMenu = (
        <Menu>
            <MenuItem
                roleStructure="listoption"
                selected={selectionMode === ListogramSelectionMode.KEEPING}
                text={keepingText}
                onClick={getItemClickHandler(ListogramSelectionMode.KEEPING)}
            />
            <MenuItem
                roleStructure="listoption"
                selected={selectionMode === ListogramSelectionMode.EXCLUDING}
                text={excludingText}
                onClick={getItemClickHandler(ListogramSelectionMode.EXCLUDING)}
            />
        </Menu>
    );

    return (
        <div className={classNames(LISTOGRAM_DRAWER, LISTOGRAM_SELECTION_DRAWER, CoreClasses.TEXT_MUTED)}>
            <div className={LISTOGRAM_SELECTION_MODE}>
                <Popover
                    content={selectionModeMenu}
                    popoverClassName={LISTOGRAM_SELECTION_MODE_POPOVER}
                    position="bottom-left"
                >
                    <Button
                        className={classNames(BUTTON_LINK, LISTOGRAM_SELECTION_MODE_BUTTON)}
                        minimal={true}
                        intent="primary"
                        text={selectionMode === ListogramSelectionMode.KEEPING ? keepingText : excludingText}
                    />
                </Popover>
                {formatSelectionSummary(numSelectedItems, numTotalItems)}
            </div>
            <Button
                className={classNames(BUTTON_LINK, LISTOGRAM_SELECTION_CLEAR_ALL)}
                minimal={true}
                intent="primary"
                onClick={onClearSelection}
                text={labels?.clearAll ?? "Clear all"}
                disabled={numSelectedItems === 0}
            />
        </div>
    );
};

function defaultFormatSelectionSummary(selected: number, total: number) {
    return `${selected} of ${total} values`;
}

function capitalize(str: string) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}
