/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import {
    AbstractComponent,
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
import * as Classes from "../../common/classes";
import { ISelectItemRendererProps, Select } from "../select/select";
import { formatTimezone, TimezoneDisplayFormat } from "./timezoneDisplayFormat";
import { getInitialTimezoneItems, getTimezoneItems, ITimezoneItem } from "./timezoneItems";
import { filterWithQueryCandidates, getTimezoneQueryCandidates } from "./timezoneUtils";

export { TimezoneDisplayFormat };

export interface ITimezonePickerProps extends IProps {
    /**
     * The currently selected timezone, e.g. "Pacific/Honolulu".
     * If this prop is provided, the component acts in a controlled manner.
     * https://en.wikipedia.org/wiki/Tz_database#Names_of_time_zones
     */
    value?: string;

    /**
     * Callback invoked when the user selects a timezone.
     */
    onChange?: (timezone: string) => void;

    /**
     * The date to use when determining timezone offsets.
     * A timezone usually has more than one offset from UTC due to daylight saving time.
     * @default now
     */
    date?: Date;

    /**
     * Initial timezone that will display as selected, when the component is uncontrolled.
     * This should not be set if `value` is set.
     */
    defaultValue?: string;

    /**
     * Whether to show the local timezone at the top of the list of initial timezone suggestions.
     * @default true
     */
    showLocalTimezone?: boolean;

    /**
     * Format to use when displaying the selected (or default) timezone within the target element.
     * @default TimezoneDisplayFormat.OFFSET
     */
    valueDisplayFormat?: TimezoneDisplayFormat;

    /**
     * Whether this component is non-interactive.
     * @default false
     */
    disabled?: boolean;

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

export interface ITimezonePickerState {
    date?: Date;
    value?: string;
    query?: string;
}

const TypedSelect = Select.ofType<ITimezoneItem>();

@PureRender
export class TimezonePicker extends AbstractComponent<ITimezonePickerProps, ITimezonePickerState> {
    public static displayName = "Blueprint.TimezonePicker";

    public static defaultProps: Partial<ITimezonePickerProps> = {
        disabled: false,
        inputProps: {},
        placeholder: "Select timezone...",
        popoverProps: {},
        showLocalTimezone: true,
    };

    private timezoneItems: ITimezoneItem[];
    private initialTimezoneItems: ITimezoneItem[];

    constructor(props: ITimezonePickerProps, context?: any) {
        super(props, context);

        const { value, date = new Date(), showLocalTimezone, inputProps = {} } = props;
        const query = inputProps.value !== undefined ? inputProps.value : "";
        this.state = { date, value, query };

        this.timezoneItems = getTimezoneItems(date);
        this.initialTimezoneItems = getInitialTimezoneItems(date, showLocalTimezone);
    }

    public render() {
        const { className, disabled, inputProps, popoverProps } = this.props;
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
                noResults={<MenuItem disabled text="No matching timezones." />}
                onItemSelect={this.handleItemSelect}
                resetOnSelect={true}
                resetOnClose={true}
                popoverProps={finalPopoverProps}
                inputProps={finalInputProps}
                disabled={disabled}
                onQueryChange={this.handleQueryChange}
            >
                {this.renderButton()}
            </TypedSelect>
        );
    }

    public componentWillReceiveProps(nextProps: ITimezonePickerProps) {
        const { date: nextDate = new Date(), inputProps: nextInputProps = {} } = nextProps;
        const dateChanged = this.state.date.getTime() !== nextDate.getTime();

        if (dateChanged) {
            this.timezoneItems = getTimezoneItems(nextDate);
        }
        if (dateChanged || this.props.showLocalTimezone !== nextProps.showLocalTimezone) {
            this.initialTimezoneItems = getInitialTimezoneItems(nextDate, nextProps.showLocalTimezone);
        }

        const nextState: ITimezonePickerState = {};
        if (dateChanged) {
            nextState.date = nextDate;
        }
        if (this.state.value !== nextProps.value) {
            nextState.value = nextProps.value;
        }
        if (nextInputProps.value !== undefined && this.state.query !== nextInputProps.value) {
            nextState.query = nextInputProps.value;
        }
        this.setState(nextState);
    }

    private renderButton() {
        const {
            disabled,
            valueDisplayFormat = TimezoneDisplayFormat.OFFSET,
            defaultValue,
            placeholder,
            buttonProps = {},
        } = this.props;
        const { date, value } = this.state;

        const finalValue = value ? value : defaultValue;
        const displayValue = finalValue ? formatTimezone(finalValue, date, valueDisplayFormat) : undefined;

        return (
            <Button
                rightIconName="caret-down"
                disabled={disabled}
                text={displayValue || placeholder}
                {...buttonProps}
            />
        );
    }

    private filterItems = (query: string, items: ITimezoneItem[]): ITimezoneItem[] => {
        if (query === "") {
            return items;
        }

        const { date } = this.state;
        return filterWithQueryCandidates(
            items,
            query,
            item => item.timezone,
            item => getTimezoneQueryCandidates(item.timezone, date),
        );
    };

    private renderItem = (itemProps: ISelectItemRendererProps<ITimezoneItem>) => {
        const { item, isActive, handleClick } = itemProps;
        const classes = classNames(CoreClasses.MENU_ITEM, CoreClasses.intentClass(), {
            [CoreClasses.ACTIVE]: isActive,
            [CoreClasses.INTENT_PRIMARY]: isActive,
        });

        return (
            <MenuItem
                key={item.key}
                className={classes}
                iconName={item.iconName}
                text={item.text}
                label={item.label}
                onClick={handleClick}
                shouldDismissPopover={false}
            />
        );
    };

    private handleItemSelect = (timezone: ITimezoneItem) => {
        if (this.props.value === undefined) {
            this.setState({ value: timezone.timezone });
        }
        Utils.safeInvoke(this.props.onChange, timezone.timezone);
    };

    private handleQueryChange = (query: string) => {
        this.setState({ query });
    };
}
