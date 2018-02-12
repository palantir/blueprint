/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import {
    AbstractPureComponent,
    Button,
    Classes as CoreClasses,
    HTMLInputProps,
    IButtonProps,
    IInputGroupProps,
    IPopoverProps,
    IProps,
    MenuItem,
    Utils,
} from "@blueprintjs/core";
import { ItemListPredicate, ItemRenderer, Select } from "@blueprintjs/select";
import * as Classes from "../common/classes";
import { ITimezoneItem } from "./timezoneItem";

export { ITimezoneItem };

export interface ITimezonePickerProps extends IProps {
    /** List of timezones, with optional properties for customizing appearance. */
    timezones: ITimezoneItem[];

    /**
     * The currently selected timezone, e.g. "Pacific/Honolulu".
     * If this prop is provided, the component acts in a controlled manner.
     * https://en.wikipedia.org/wiki/Tz_database#Names_of_time_zones
     */
    value: string;

    /**
     * Callback invoked when the user selects a timezone.
     */
    onChange: (timezone: string) => void;

    /** Customize the button content. If omitted, `value` prop will be rendered. */
    children?: React.ReactNode;

    /**
     * Whether this component is non-interactive.
     * @default false
     */
    disabled?: boolean;

    /**
     * Timezone list displayed when the query is empty.
     * If this prop is omitted, the first `maxResults` entries in `timezones` will be shown.
     */
    initialTimezones?: ITimezoneItem[];

    /**
     * Customize the filtering algorithm. If this prop is defined then `initialTimezones` is ignored, but
     * you can easily re-implement this in your predicate by checking `if (query === "")`.
     */
    itemListPredicate?: ItemListPredicate<ITimezoneItem>;

    /**
     * Maximum number of results to display in the menu.
     * @default 12
     */
    maxResults?: number;

    /**
     * Text to show when no timezone has been selected and there is no default.
     * @default "Select timezone..."
     */
    placeholder?: string;

    /** Props to spread to the target `Button`. */
    buttonProps?: Partial<IButtonProps>;

    /**
     * Props to spread to the filter `InputGroup`.
     * All props are supported except `ref` (use `inputRef` instead).
     * If you want to control the filter input, you can pass `value` and `onChange` here
     * to override `Select`'s own behavior.
     */
    inputProps?: IInputGroupProps & HTMLInputProps;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;
}

const TypedSelect = Select.ofType<ITimezoneItem>();

export class TimezonePicker extends AbstractPureComponent<ITimezonePickerProps> {
    public static displayName = "Blueprint2.TimezonePicker";

    public static defaultProps: Partial<ITimezonePickerProps> = {
        disabled: false,
        inputProps: {},
        maxResults: 12,
        placeholder: "Select timezone...",
        popoverProps: {},
    };

    public render() {
        const { className, disabled, itemListPredicate = this.filterItems, inputProps, popoverProps } = this.props;

        const finalInputProps = {
            placeholder: "Search timezones...",
            ...inputProps,
        };
        const finalPopoverProps: Partial<IPopoverProps> = {
            ...popoverProps,
            popoverClassName: classNames(Classes.TIMEZONE_PICKER_POPOVER, popoverProps.popoverClassName),
        };

        return (
            <TypedSelect
                className={classNames(Classes.TIMEZONE_PICKER, className)}
                items={this.props.timezones}
                itemListPredicate={itemListPredicate}
                itemRenderer={this.renderItem}
                noResults={<MenuItem disabled={true} text="No matching timezones." />}
                onItemSelect={this.handleItemSelect}
                resetOnSelect={true}
                resetOnClose={true}
                popoverProps={finalPopoverProps}
                inputProps={finalInputProps}
                disabled={disabled}
            >
                {this.renderButton()}
            </TypedSelect>
        );
    }

    private renderButton() {
        const { disabled, placeholder, value, children = value, buttonProps = {} } = this.props;
        return (
            <Button rightIcon="caret-down" disabled={disabled} {...buttonProps}>
                {value ? children : <span className={CoreClasses.TEXT_MUTED}>{placeholder}</span>}
            </Button>
        );
    }

    private renderItem: ItemRenderer<ITimezoneItem> = (item, { handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }

        const classes = classNames(CoreClasses.MENU_ITEM, CoreClasses.intentClass(), {
            [CoreClasses.ACTIVE]: modifiers.active,
            [CoreClasses.INTENT_PRIMARY]: modifiers.active,
        });

        const { timezone, key = timezone, displayName = timezone } = item;

        return (
            <MenuItem
                key={key}
                className={classes}
                icon={item.iconName}
                text={displayName}
                label={item.label}
                onClick={handleClick}
                shouldDismissPopover={false}
            />
        );
    };

    private filterItems: ItemListPredicate<ITimezoneItem> = (query, items) => {
        const { maxResults, timezones, initialTimezones = timezones.slice(0, maxResults) } = this.props;
        if (query === "") {
            return initialTimezones;
        }
        return items.filter(item => item.timezone.toLowerCase().indexOf(query.toLowerCase()) >= 0);
    };

    private handleItemSelect = (timezone: ITimezoneItem) => Utils.safeInvoke(this.props.onChange, timezone.timezone);
}
