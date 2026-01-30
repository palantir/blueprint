/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import type * as React from "react";

import type { ContextMenuProps } from "@blueprintjs/core";

export type ListogramItemId = string & { __listogramNodeId: void };

export interface ListogramBaseItem {
    /**
     * Number which determines the bar width.
     */
    count: number;

    /**
     * The default behavior is to show the count, or the countSubtotal/count if the item
     * has a countSubtotal. Pass in something here if you want to display a different
     * value next to the count bar.
     */
    countDisplayValue?: React.ReactNode;

    /**
     * Number which determines width of bar which appears as a subset of the count bar.
     */
    countSubtotal?: number;
}

export interface ListogramItemGroupBase {
    /**
     * Optional props for a custom context menu on this item.
     * Note that this custom menu will be disabled if `disabled` is `false`.
     */
    contextMenu?: Omit<ContextMenuProps, "children" | "tagName">;

    /**
     * Unique Id so React can avoid rerendering when unnecessary.
     */
    id: ListogramItemId;

    /**
     * Text associated with count bar.
     */
    title: React.ReactNode;

    /**
     * Optional parameter if you want to be able to sort the text alphabetically.
     */
    titleText?: string;

    /**
     * Whether or not interaction is allowed on the item.
     */
    disabled?: boolean;
}

// ListogramItem simply is *both* an item *and* a group
export interface ListogramItem extends ListogramBaseItem, ListogramItemGroupBase {}

// Using "serie" as the singular of "series"
export interface ListogramSerieItem extends ListogramBaseItem {
    /**
     * Key that uniquely refers to this serie.
     */
    key: string;
}

export interface ListogramSerieMetadata {
    /**
     * Unique key that identifies this serie. Must match the `key`(s) used in
     * the `ListogramSerieItem`(s) in additionalCounts in items.
     */
    key: string;

    /**
     * The human-readable string to use to refer to this serie in
     * the tooltip. If undefined, `key` is used instead.
     */
    title?: string;

    /**
     * Color to apply to elements of this serie. Only applied
     * if all series have this property set.
     */
    color?: string;
}

export interface ListogramSelectionState {
    selectedItemIds: Set<ListogramItemId>; // we maintain order added here to do selection logic in DEFAULT selection kind
    shiftSelection: Set<ListogramItemId>;
    previouslyClickedId: ListogramItemId | undefined;
}

/**
 * Enumeration of Selection Behaviors.
 */
export const ListogramSelectionKind = {
    /**
     * Imitates classic list selection behavior: click to select only that item;
     * use cmd/ctrl click to toggle items and shift click to add ranges.
     *
     * If the `showSelectionToggles` prop is enabled, clicking without any
     * modifier keys becomes a toggle behavior instead of clearing the
     * selection.
     */
    MULTIPLE: "multiple" as const,

    /** Only allows one item to be selected at a time. */
    SINGLE: "single" as const,

    /** Clicking an item changes its state to selected/unselected. */
    TOGGLE: "toggle" as const,
};
export type ListogramSelectionKind = (typeof ListogramSelectionKind)[keyof typeof ListogramSelectionKind];

/**
 * Enumeration of selection modes
 */
export const ListogramSelectionMode = {
    /**
     * Keep the selected values in the listogram selection
     */
    KEEPING: "keeping" as const,

    /**
     * Keep all but the selected values in the listogram selection
     */
    EXCLUDING: "excluding" as const,
};
export type ListogramSelectionMode = (typeof ListogramSelectionMode)[keyof typeof ListogramSelectionMode];

/**
 * Enumeration of Sort directions
 */
export const ListogramSortDirection = {
    /**
     * Sorts values from lowest to highest.
     */
    ASCENDING: "ascending" as const,

    /**
     * Sorts values from highest to lowest.
     */
    DESCENDING: "descending" as const,
};
export type ListogramSortDirection = (typeof ListogramSortDirection)[keyof typeof ListogramSortDirection];

/**
 * The built-in sort types for the listogram.
 */
export const ListogramSortKind = {
    /**
     * Sorts on string title of the listogram item.
     *
     * If a listogram uses JSX for its `title`, then the `titleText` string prop
     * must be defined for the item to be sorted correctly.
     */
    TITLE: "title" as const,

    /**
     * Sorts on `countSubtotal` values.
     */
    SUBTOTAL: "subtotal" as const,

    /**
     * Sorts on `count` values.
     */
    COUNT: "count" as const,
};
export type ListogramSortKind = (typeof ListogramSortKind)[keyof typeof ListogramSortKind];

/**
 * Override Text for sort menu.
 */
export interface ListogramSortKindLabels {
    /**
     * @default "Count"
     */
    count?: string;
    /**
     * @default "Subtotal"
     */
    subtotal?: string;
    /**
     * @default "Title"
     */
    title?: string;
}

/**
 * Labels text for various UI elements which may be overridden for localization/i18n in non-English environments.
 */
export type ListogramLabels = {
    sortKind?: ListogramSortKindLabels;
};
