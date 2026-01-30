/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import type { Checkbox, MenuItemProps, Radio } from "@blueprintjs/core";

import type { ExcludedCheckbox } from "./excludedCheckbox";
import type { ListogramItemId } from "./listogramTypes";

export interface ListogramItemSharedProps extends Pick<MenuItemProps, "shouldDismissPopover"> {
    /**
     * The maximum value used to scale bar widths (the denominator in
     * the bar width percentage calculation: `item.count / countTotal`).
     */
    countTotal: number;

    /**
     * The total number of items in the listogram. Some may not be rendered.
     */
    numItems: number;

    /**
     * Whether to show the histogram bar (a visual indicator of the item's count).
     *
     * @default true
     */
    showBar?: boolean;

    /**
     * Whether the item is active/selected.
     */
    isSelected: boolean;

    /**
     * Component used to visualize selection state. If `undefined`, selection
     * will appear as the background color.
     */
    selectionComponent: typeof Checkbox | typeof Radio | typeof ExcludedCheckbox | undefined;

    /**
     * Optional class name to pass to the `<Text>` element within each menu item.
     */
    textClassName?: string;

    /**
     * Callback triggered onClick anywhere on the item.
     */
    onItemClick: (itemId: ListogramItemId, evt: React.MouseEvent<HTMLElement>) => void;

    /** Whether count subtotal bar should appear. */
    showSubTotal: boolean;

    /**
     * Apply a formatter to the values in the listogram. By default, values
     * will be displayed as plain numbers without formatting.
     */
    valueFormatter?: (value: number) => React.ReactNode;

    /**
     * Whether the item is the first of a series of consecutive selected items.
     */
    isFirstOfSelectionBlob?: boolean;

    /**
     * Whether the item is the last of a series of consecutive selected items.
     */
    isLastOfSelectionBlob?: boolean;
}
