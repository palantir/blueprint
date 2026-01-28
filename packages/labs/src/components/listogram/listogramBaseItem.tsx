/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import classNames from "classnames";
import * as React from "react";

import { MenuItem, type Props } from "@blueprintjs/core";

import {
    LISTOGRAM_BAR,
    LISTOGRAM_ITEM,
    LISTOGRAM_ITEM_FIRST_OF_SELECTION_BLOB,
    LISTOGRAM_ITEM_LAST_OF_SELECTION_BLOB,
    LISTOGRAM_ITEM_TOGGLE_CONTROL,
} from "./listogramClasses";
import type { ListogramItemSharedProps } from "./listogramItemProps";
import type { IListogramItemGroupBase } from "./listogramTypes";

export interface ListogramBaseItemProps extends ListogramItemSharedProps {
    /**
     * An ItemGroup has one id and label, but potentially multiple counts
     * (MultiListogram). Refered to as an "item" in general.
     */
    item: IListogramItemGroupBase;

    renderBars: (v: void) => React.ReactNode;

    renderText: (title: React.ReactNode) => React.ReactNode;

    menuItemClassName?: string;
}

export class ListogramBaseItem extends React.PureComponent<ListogramBaseItemProps> {
    public render() {
        const { disabled, title } = this.props.item;
        const {
            isSelected,
            selectionComponent,
            isFirstOfSelectionBlob,
            isLastOfSelectionBlob,
            renderBars,
            renderText,
            menuItemClassName,
            numItems,
            shouldDismissPopover,
        } = this.props;

        return (
            <MenuItem
                key={this.props.item.id}
                disabled={disabled}
                className={classNames(LISTOGRAM_ITEM, menuItemClassName, {
                    [LISTOGRAM_ITEM_FIRST_OF_SELECTION_BLOB]: isFirstOfSelectionBlob,
                    [LISTOGRAM_ITEM_LAST_OF_SELECTION_BLOB]: isLastOfSelectionBlob,
                })}
                icon={this.maybeRenderToggle(isSelected, selectionComponent, disabled ?? false)}
                labelElement={renderBars()}
                onClick={this.handleItemClick}
                active={isSelected && selectionComponent == null}
                text={renderText(title)}
                shouldDismissPopover={shouldDismissPopover}
                role="option"
                aria-selected={isSelected}
                aria-setsize={numItems} // Necessary because some list elements may be hidden
            />
        );
    }

    private maybeRenderToggle(
        isSelected: boolean,
        Component: ListogramItemSharedProps["selectionComponent"],
        disabled: boolean,
    ) {
        if (Component == null) {
            return null;
        }

        return (
            <Component
                disabled={disabled}
                className={LISTOGRAM_ITEM_TOGGLE_CONTROL}
                checked={isSelected}
                readOnly={true}
                tabIndex={-1}
            />
        );
    }

    private handleItemClick = (evt: React.MouseEvent<HTMLElement>) => {
        evt.persist();

        // Prevent the click from propagating to the checkbox when the checkbox itself is clicked, which would toggle
        // the selection twice.
        evt.preventDefault();

        this.props.onItemClick(this.props.item.id, evt);
    };
}

export const CountBar: React.FC<{ count: number; total: number; color?: string } & Props> = props => {
    if (props.count == null) {
        return null;
    }
    const percentage = Math.round((props.count * 100) / props.total);
    return (
        <span
            className={classNames(LISTOGRAM_BAR, props.className)}
            style={{
                backgroundColor: `${props.color}`,
                width: `${percentage}%`,
            }}
        />
    );
};
