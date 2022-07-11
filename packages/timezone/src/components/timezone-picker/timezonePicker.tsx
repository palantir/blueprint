/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import {
    AbstractPureComponent2,
    Button,
    ButtonProps,
    Classes as CoreClasses,
    DISPLAYNAME_PREFIX,
    InputGroupProps2,
    IPopoverProps,
    MenuItem,
    Props,
} from "@blueprintjs/core";
import { ItemListPredicate, ItemRenderer, Select } from "@blueprintjs/select";

import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { formatTimezone, TimezoneDisplayFormat } from "./timezoneDisplayFormat";
import { getInitialTimezoneItems, getTimezoneItems, TimezoneItem } from "./timezoneItems";

export { TimezoneDisplayFormat };

// eslint-disable-next-line deprecation/deprecation
export type TimezonePickerProps = ITimezonePickerProps;
/** @deprecated use TimezonePickerProps */
export interface ITimezonePickerProps extends Props {
    children?: React.ReactNode;

    /**
     * The currently selected timezone UTC identifier, e.g. "Pacific/Honolulu".
     *
     * @see https://www.iana.org/time-zones
     */
    value: string | undefined;

    /**
     * Callback invoked when the user selects a timezone.
     */
    onChange: (timezone: string) => void;

    /**
     * The date to use when formatting timezone offsets.
     * An offset date is necessary to account for DST, but typically the default value of `now` will be sufficient.
     *
     * @default now
     */
    date?: Date;

    /**
     * Whether this component is non-interactive.
     * This prop will be ignored if `children` is provided.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Whether to show the local timezone at the top of the list of initial timezone suggestions.
     *
     * @default true
     */
    showLocalTimezone?: boolean;

    /**
     * Format to use when displaying the selected (or default) timezone within the target element.
     * This prop will be ignored if `children` is provided.
     *
     * @default TimezoneDisplayFormat.OFFSET
     */
    valueDisplayFormat?: TimezoneDisplayFormat;

    /**
     * Text to show when no timezone has been selected (`value === undefined`).
     * This prop will be ignored if `children` is provided.
     *
     * @default "Select timezone..."
     */
    placeholder?: string;

    /**
     * Props to spread to the target `Button`.
     * This prop will be ignored if `children` is provided.
     */
    buttonProps?: Partial<ButtonProps>;

    /**
     * Props to spread to the filter `InputGroup`.
     * All props are supported except `ref` (use `inputRef` instead).
     * If you want to control the filter input, you can pass `value` and `onChange` here
     * to override `Select`'s own behavior.
     */
    inputProps?: InputGroupProps2;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    // eslint-disable-next-line deprecation/deprecation
    popoverProps?: Partial<IPopoverProps>;
}

export interface ITimezonePickerState {
    query: string;
}

// eslint-disable-next-line deprecation/deprecation
const TypedSelect = Select.ofType<TimezoneItem>();

/** @deprecated use { TimezoneSelect } from "@blueprintjs/datetime2" */
export class TimezonePicker extends AbstractPureComponent2<TimezonePickerProps, ITimezonePickerState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TimezonePicker`;

    public static defaultProps: Partial<TimezonePickerProps> = {
        date: new Date(),
        disabled: false,
        inputProps: {},
        placeholder: "Select timezone...",
        popoverProps: {},
        showLocalTimezone: true,
        valueDisplayFormat: TimezoneDisplayFormat.OFFSET,
    };

    private timezoneItems: TimezoneItem[];

    private initialTimezoneItems: TimezoneItem[];

    constructor(props: TimezonePickerProps, context?: any) {
        super(props, context);

        const { date = new Date(), showLocalTimezone, inputProps = {} } = props;
        this.state = { query: inputProps.value || "" };

        this.timezoneItems = getTimezoneItems(date);
        this.initialTimezoneItems = getInitialTimezoneItems(date, showLocalTimezone);
    }

    public render() {
        const { children, className, disabled, inputProps, popoverProps } = this.props;
        const { query } = this.state;

        const finalInputProps: InputGroupProps2 = {
            placeholder: "Search for timezones...",
            ...inputProps,
        };
        // eslint-disable-next-line deprecation/deprecation
        const finalPopoverProps: Partial<IPopoverProps> = {
            ...popoverProps,
            popoverClassName: classNames(Classes.TIMEZONE_PICKER_POPOVER, popoverProps.popoverClassName),
        };

        return (
            <TypedSelect
                className={classNames(Classes.TIMEZONE_PICKER, className)}
                items={query ? this.timezoneItems : this.initialTimezoneItems}
                itemListPredicate={this.filterItems}
                itemRenderer={this.renderItem}
                noResults={<MenuItem disabled={true} text="No matching timezones." />}
                onItemSelect={this.handleItemSelect}
                resetOnSelect={true}
                resetOnClose={true}
                popoverProps={finalPopoverProps}
                inputProps={finalInputProps}
                disabled={disabled}
                onQueryChange={this.handleQueryChange}
            >
                {children != null ? children : this.renderButton()}
            </TypedSelect>
        );
    }

    public componentDidUpdate(prevProps: TimezonePickerProps, prevState: ITimezonePickerState) {
        super.componentDidUpdate(prevProps, prevState);
        const { date: nextDate = new Date(), inputProps: nextInputProps = {} } = this.props;

        if (this.props.showLocalTimezone !== prevProps.showLocalTimezone) {
            this.initialTimezoneItems = getInitialTimezoneItems(nextDate, this.props.showLocalTimezone);
        }
        if (nextInputProps.value !== undefined && this.state.query !== nextInputProps.value) {
            this.setState({ query: nextInputProps.value });
        }
    }

    protected validateProps(props: TimezonePickerProps & { children?: React.ReactNode }) {
        const childrenCount = React.Children.count(props.children);
        if (childrenCount > 1) {
            console.warn(Errors.TIMEZONE_PICKER_WARN_TOO_MANY_CHILDREN);
        }
    }

    private renderButton() {
        const { buttonProps = {}, date, disabled, placeholder, value, valueDisplayFormat } = this.props;
        const buttonContent = value ? (
            formatTimezone(value, date, valueDisplayFormat)
        ) : (
            <span className={CoreClasses.TEXT_MUTED}>{placeholder}</span>
        );
        return <Button rightIcon="caret-down" disabled={disabled} text={buttonContent} {...buttonProps} />;
    }

    private filterItems: ItemListPredicate<TimezoneItem> = (query, items) => {
        // using list predicate so only one RegExp instance is needed
        // escape bad regex characters, let spaces act as any separator
        const expr = new RegExp(query.replace(/([[()+*?])/g, "\\$1").replace(" ", "[ _/\\(\\)]+"), "i");
        return items.filter(item => expr.test(item.text + item.label));
    };

    private renderItem: ItemRenderer<TimezoneItem> = (item, { handleClick, handleFocus, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                key={item.key}
                selected={modifiers.active}
                icon={item.iconName}
                text={item.text}
                label={item.label}
                onClick={handleClick}
                onFocus={handleFocus}
                shouldDismissPopover={false}
            />
        );
    };

    private handleItemSelect = (timezone: TimezoneItem) => this.props.onChange?.(timezone.timezone);

    private handleQueryChange = (query: string) => this.setState({ query });
}
