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
import * as React from "react";

import {
    AbstractPureComponent2,
    Button,
    ButtonProps,
    Classes as CoreClasses,
    DISPLAYNAME_PREFIX,
    InputGroupProps2,
    MenuItem,
    Props,
} from "@blueprintjs/core";
import type { Popover2Props } from "@blueprintjs/popover2";
import { ItemListPredicate, ItemRenderer, Select2 } from "@blueprintjs/select";

import * as Classes from "../../common/classes";
import { TIMEZONE_ITEMS } from "./timezoneItems";
import { getInitialTimezoneItems, ITimeZoneWithNames, mapTimezonesWithNames } from "./timezoneNameUtils";

export interface TimeZonePicker2Props extends Props {
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

    /** Props to spread to `Popover2`. Note that `content` cannot be changed. */
    popoverProps?: Partial<Omit<Popover2Props, "content">>;
}

export interface ITimezonePicker2State {
    query: string;
}

const TypedSelect = Select2.ofType<ITimeZoneWithNames>();

export class TimeZonePicker2 extends AbstractPureComponent2<TimeZonePicker2Props, ITimezonePicker2State> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TimezonePicker`;

    public static defaultProps: Partial<TimeZonePicker2Props> = {
        date: new Date(),
        disabled: false,
        inputProps: {},
        placeholder: "Select timezone...",
        popoverProps: {},
        showLocalTimezone: false,
    };

    private timezoneItems: ITimeZoneWithNames[];

    private initialTimezoneItems: ITimeZoneWithNames[];

    constructor(props: TimeZonePicker2Props, context?: any) {
        super(props, context);

        const { showLocalTimezone, inputProps = {}, date } = props;
        this.state = { query: inputProps.value || "" };
        this.timezoneItems = mapTimezonesWithNames(date, TIMEZONE_ITEMS);
        this.initialTimezoneItems = getInitialTimezoneItems(date, showLocalTimezone);
    }

    public render() {
        const { children, className, disabled, inputProps, popoverProps } = this.props;
        const { query } = this.state;
        const finalInputProps: InputGroupProps2 = {
            placeholder: "Search for timezones...",
            ...inputProps,
        };
        const finalPopoverProps: Partial<Popover2Props> = {
            ...popoverProps,
            popoverClassName: classNames(Classes.TIMEZONE_PICKER_POPOVER, popoverProps.popoverClassName),
        };

        return (
            <TypedSelect
                className={classNames(Classes.TIMEZONE_PICKER, className)}
                disabled={disabled}
                inputProps={finalInputProps}
                itemListPredicate={this.filterItems}
                itemRenderer={this.renderItem}
                items={query ? this.timezoneItems : this.initialTimezoneItems}
                noResults={<MenuItem disabled={true} text="No matching timezones." />}
                onItemSelect={this.handleItemSelect}
                onQueryChange={this.handleQueryChange}
                popoverProps={finalPopoverProps}
                resetOnClose={true}
                resetOnSelect={true}
                targetClassName={Classes.TIMEZONE_PICKER_TARGET}
            >
                {children != null ? children : this.renderButton()}
            </TypedSelect>
        );
    }

    public componentDidUpdate(prevProps: TimeZonePicker2Props, prevState: ITimezonePicker2State) {
        super.componentDidUpdate(prevProps, prevState);
        const { date: nextDate } = this.props;

        if (this.props.showLocalTimezone !== prevProps.showLocalTimezone) {
            this.initialTimezoneItems = getInitialTimezoneItems(nextDate, this.props.showLocalTimezone);
        }
        if (nextDate != null && nextDate.getTime() !== prevProps.date?.getTime()) {
            this.initialTimezoneItems = mapTimezonesWithNames(nextDate, this.initialTimezoneItems);
            this.timezoneItems = mapTimezonesWithNames(nextDate, this.timezoneItems);
        }
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

    private filterItems: ItemListPredicate<ITimeZoneWithNames> = (query, items) => {
        // using list predicate so only one RegExp instance is needed
        // escape bad regex characters, let spaces act as any separator
        const expr = new RegExp(query.replace(/([[()+*?])/g, "\\$1").replace(" ", "[ _/\\(\\)]+"), "i");
        return items.filter(item => expr.test(item.ianaCode) || expr.test(item.label) || expr.test(item.longName));
    };

    private renderItem: ItemRenderer<ITimeZoneWithNames> = (item, { handleClick, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                key={item.ianaCode}
                selected={modifiers.active}
                text={`${item.label}, ${item.longName}`}
                onClick={handleClick}
                label={item.shortName}
                shouldDismissPopover={false}
            />
        );
    };

    private handleItemSelect = (timezone: ITimeZoneWithNames) => this.props.onChange?.(timezone.ianaCode);

    private handleQueryChange = (query: string) => this.setState({ query });
}
