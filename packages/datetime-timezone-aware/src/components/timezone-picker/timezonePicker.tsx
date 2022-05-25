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

import classNames from "classnames";
import { formatInTimeZone } from "date-fns-tz";
import { partition } from "lodash-es";
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
import { getTimeZone } from "../../common/getTimeZone";
import { ITimeZone, TIMEZONE_ITEMS } from "./timezoneItems";

export interface TimeZonePickerProps extends Props {
    children?: React.ReactNode;

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
     * @default false
     */
    showLocalTimezone?: boolean;

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
    popoverProps?: Partial<IPopoverProps>;
}

export interface ITimezonePickerState {
    query: string;
}

const CURRENT_DATE = Date.now();

const TypedSelect = Select.ofType<ITimeZone>();

export class TimeZonePicker extends AbstractPureComponent2<TimeZonePickerProps, ITimezonePickerState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TimezonePicker`;

    public static defaultProps: Partial<TimeZonePickerProps> = {
        date: new Date(),
        disabled: false,
        inputProps: {},
        placeholder: "Select timezone...",
        popoverProps: {},
        showLocalTimezone: false,
    };

    private timezoneItems: ITimeZone[];

    constructor(props: TimeZonePickerProps, context?: any) {
        super(props, context);

        const { showLocalTimezone, inputProps = {} } = props;
        this.state = { query: inputProps.value || "" };
        const [localTimezone, otherTimezones] = partition(TIMEZONE_ITEMS, item => item.ianaCode === getTimeZone());
        this.timezoneItems = showLocalTimezone ? [...localTimezone, ...otherTimezones] : [...TIMEZONE_ITEMS];
    }

    public render() {
        const { children, className, disabled, inputProps, popoverProps } = this.props;

        const finalInputProps: InputGroupProps2 = {
            placeholder: "Search for timezones...",
            ...inputProps,
        };
        const finalPopoverProps: Partial<IPopoverProps> = {
            ...popoverProps,
            popoverClassName: classNames(Classes.TIMEZONE_PICKER_POPOVER, popoverProps.popoverClassName),
            targetClassName: Classes.TIMEZONE_PICKER_TARGET,
        };

        return (
            <TypedSelect
                className={classNames(Classes.TIMEZONE_PICKER, className)}
                items={this.timezoneItems}
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

    private renderButton() {
        const { buttonProps = {}, disabled, placeholder, value } = this.props;
        const selectedTimezone = this.timezoneItems.find(tz => tz.ianaCode === value);
        const buttonContent = selectedTimezone ? (
            selectedTimezone.label
        ) : (
            <span className={CoreClasses.TEXT_MUTED}>{placeholder}</span>
        );
        return <Button rightIcon="caret-down" disabled={disabled} text={buttonContent} {...buttonProps} fill={true} />;
    }

    private filterItems: ItemListPredicate<ITimeZone> = (query, items) => {
        // using list predicate so only one RegExp instance is needed
        // escape bad regex characters, let spaces act as any separator
        const expr = new RegExp(query.replace(/([[()+*?])/g, "\\$1").replace(" ", "[ _/\\(\\)]+"), "i");
        return items.filter(
            item =>
                expr.test(item.ianaCode) ||
                expr.test(item.label) ||
                expr.test(getTimeZoneName(this.props.date, item.ianaCode)),
        );
    };

    private renderItem: ItemRenderer<ITimeZone> = (item, { handleClick, modifiers }) => {
        const { date } = this.props;
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                key={item.ianaCode}
                selected={modifiers.active}
                text={`${item.label} ${getTimeZoneName(date, item.ianaCode)}`}
                onClick={handleClick}
                label={getTimeZoneName(date, item.ianaCode, false)}
                shouldDismissPopover={false}
            />
        );
    };

    private handleItemSelect = (timezone: ITimeZone) => this.props.onChange?.(timezone.ianaCode);

    private handleQueryChange = (query: string) => this.setState({ query });
}

const getTimeZoneName = (date: Date | undefined, ianaCode: string, getLongName: boolean = true) =>
    formatInTimeZone(date ?? CURRENT_DATE, ianaCode, getLongName ? "zzzz" : "zzz");
