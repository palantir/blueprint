/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
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
