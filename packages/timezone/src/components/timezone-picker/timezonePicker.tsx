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
    AbstractPureComponent,
    Button,
    Classes as CoreClasses,
    DISPLAYNAME_PREFIX,
    HTMLInputProps,
    IButtonProps,
    IInputGroupProps,
    IPopoverProps,
    IProps,
    MenuItem,
    Utils,
} from "@blueprintjs/core";
import { ItemListPredicate, ItemRenderer, Select } from "@blueprintjs/select";
import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { formatTimezone, TimezoneDisplayFormat } from "./timezoneDisplayFormat";
import { getInitialTimezoneItems, getTimezoneItems, ITimezoneItem } from "./timezoneItems";

export { TimezoneDisplayFormat };

export interface ITimezonePickerProps extends IProps {
    /**
     * The currently selected timezone UTC identifier, e.g. "Pacific/Honolulu".
     * See https://www.iana.org/time-zones for more information.
     */
    value: string | undefined;

    /**
     * Callback invoked when the user selects a timezone.
     */
    onChange: (timezone: string) => void;

    /**
     * The date to use when formatting timezone offsets.
     * An offset date is necessary to account for DST, but typically the default value of `now` will be sufficient.
     * @default now
     */
    date?: Date;

    /**
     * Whether this component is non-interactive.
     * This prop will be ignored if `children` is provided.
     * @default false
     */
    disabled?: boolean;

    /**
     * Whether to show the local timezone at the top of the list of initial timezone suggestions.
     * @default true
     */
    showLocalTimezone?: boolean;

    /**
     * Format to use when displaying the selected (or default) timezone within the target element.
     * This prop will be ignored if `children` is provided.
     * @default TimezoneDisplayFormat.OFFSET
     */
    valueDisplayFormat?: TimezoneDisplayFormat;

    /**
     * Text to show when no timezone has been selected (`value === undefined`).
     * This prop will be ignored if `children` is provided.
     * @default "Select timezone..."
     */
    placeholder?: string;

    /**
     * Props to spread to the target `Button`.
     * This prop will be ignored if `children` is provided.
     */
    buttonProps?: Partial<IButtonProps>;

    /**
     * Props to spread to the filter `InputGroup`.
     * All props are supported except `ref` (use `inputRef` instead).
     * If you want to control the filter input, you can pass `value` and `onChange` here
     * to override `Select`'s own behavior.
     */
    inputProps?: IInputGroupProps & HTMLInputProps;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps>;
}

export interface ITimezonePickerState {
    query: string;
}

const TypedSelect = Select.ofType<ITimezoneItem>();

export class TimezonePicker extends AbstractPureComponent<ITimezonePickerProps, ITimezonePickerState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TimezonePicker`;

    public static defaultProps: Partial<ITimezonePickerProps> = {
        date: new Date(),
        disabled: false,
        inputProps: {},
        placeholder: "Select timezone...",
        popoverProps: {},
        showLocalTimezone: true,
        valueDisplayFormat: TimezoneDisplayFormat.OFFSET,
    };

    private timezoneItems: ITimezoneItem[];
    private initialTimezoneItems: ITimezoneItem[];

    constructor(props: ITimezonePickerProps, context?: any) {
        super(props, context);

        const { date = new Date(), showLocalTimezone, inputProps = {} } = props;
        this.state = { query: inputProps.value || "" };

        this.timezoneItems = getTimezoneItems(date);
        this.initialTimezoneItems = getInitialTimezoneItems(date, showLocalTimezone);
    }

    public render() {
        const { children, className, disabled, inputProps, popoverProps } = this.props;
        const { query } = this.state;

        const finalInputProps: IInputGroupProps & HTMLInputProps = {
            placeholder: "Search for timezones...",
            ...inputProps,
        };
        const finalPopoverProps: Partial<IPopoverProps> & object = {
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

    public componentWillReceiveProps(nextProps: ITimezonePickerProps) {
        const { date: nextDate = new Date(), inputProps: nextInputProps = {} } = nextProps;

        if (this.props.showLocalTimezone !== nextProps.showLocalTimezone) {
            this.initialTimezoneItems = getInitialTimezoneItems(nextDate, nextProps.showLocalTimezone);
        }
        if (nextInputProps.value !== undefined && this.state.query !== nextInputProps.value) {
            this.setState({ query: nextInputProps.value });
        }
    }

    protected validateProps(props: IPopoverProps & { children?: React.ReactNode }) {
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

    private filterItems: ItemListPredicate<ITimezoneItem> = (query, items) => {
        // using list predicate so only one RegExp instance is needed
        // escape bad regex characters, let spaces act as any separator
        const expr = new RegExp(query.replace(/([[()+*?])/g, "\\$1").replace(" ", "[ _/\\(\\)]+"), "i");
        return items.filter(item => expr.test(item.text + item.label));
    };

    private renderItem: ItemRenderer<ITimezoneItem> = (item, { handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                key={item.key}
                active={modifiers.active}
                icon={item.iconName}
                text={item.text}
                label={item.label}
                onClick={handleClick}
                shouldDismissPopover={false}
            />
        );
    };

    private handleItemSelect = (timezone: ITimezoneItem) => Utils.safeInvoke(this.props.onChange, timezone.timezone);

    private handleQueryChange = (query: string) => this.setState({ query });
}
