/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as moment from "moment-timezone";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import {
    AbstractComponent,
    Button,
    Classes as CoreClasses,
    IPopoverProps,
    IProps,
    MenuItem,
    Utils,
} from "@blueprintjs/core";
import {
    ISelectItemRendererProps,
    Select,
} from "..";
import * as Classes from "../../common/classes";

export interface ITimezoneInputProps extends IProps {
    /**
     * Date to use when determining timezone offsets.
     * A timezone usually has more than one offset from UTC due to daylight saving time.
     * https://momentjs.com/guides/#/lib-concepts/timezone-offset/
     * http://momentjs.com/timezone/docs/#/using-timezones/parsing-ambiguous-inputs/
     */
    date: Date;

    /**
     * Callback invoked when a timezone from the list is selected,
     * typically by clicking or pressing `enter` key.
     */
    onTimezoneSelect: (timezone: string | undefined, event?: React.SyntheticEvent<HTMLElement>) => void;

    /** Initial timezone that will display as selected. */
    defaultTimezone?: string;

    /**
     * Whether to guess the user's timezone and show it at the top of the list of initial timezone suggestions.
     * https://momentjs.com/timezone/docs/#/using-timezones/guessing-user-timezone/
     * @default true
     */
    showUserTimezoneGuess?: boolean;

    /**
     * Format to use when displaying the selected (or default) timezone within the target element.
     * @default TimezoneFormat.OFFSET
     */
    targetFormat?: TimezoneFormat;

    /** A space-delimited list of class names to pass along to the target element. */
    targetClassName?: string;

    /**
     * Whether this input is non-interactive.
     * @default false
     */
    disabled?: boolean;

    /**
     * Text to show when no timezone has been selected and there is no default.
     * @default "Select timezone..."
     */
    placeholder?: string;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;
}

export type TimezoneFormat = "offset" | "abbreviation" | "name";
export const TimezoneFormat = {
    ABBREVIATION: "abbreviation" as "abbreviation",
    NAME: "name" as "name",
    OFFSET: "offset" as "offset",
};

export interface ITimezoneInputState {
    selectedTimezone?: string;
}

interface ITimezoneWithMetadata {
    timezone: string;
    abbreviation: string;
    offset: number;
    offsetAsString: string;
    isUserTimezoneGuess: boolean;
}

const TypedSelect = Select.ofType<ITimezoneWithMetadata>();

@PureRender
export class TimezoneInput extends AbstractComponent<ITimezoneInputProps, ITimezoneInputState> {
    public static displayName = "Blueprint.TimezoneInput";

    public static defaultProps: Partial<ITimezoneInputProps> = {
        disabled: false,
        placeholder: "Select timezone...",
        popoverProps: {},
        showUserTimezoneGuess: true,
    };

    public state: ITimezoneInputState = {};

    private timezones: ITimezoneWithMetadata[];
    private initialTimezones: ITimezoneWithMetadata[];

    constructor(props: ITimezoneInputProps, context?: any) {
        super(props, context);

        this.timezones = getTimezones(props.date);
        this.initialTimezones = getInitialTimezones(props.date, props.showUserTimezoneGuess);
    }

    public render() {
        const { className, placeholder, disabled, popoverProps, targetClassName } = this.props;
        const finalPopoverProps: Partial<IPopoverProps> & object = {
            ...popoverProps,
            popoverClassName: classNames(popoverProps.popoverClassName, Classes.TIMEZONE_INPUT_POPOVER),
        };

        return (
            <TypedSelect
                className={classNames(Classes.TIMEZONE_INPUT, className)}
                items={this.timezones}
                itemListPredicate={this.filterTimezones}
                itemRenderer={this.renderTimezone}
                noResults={<MenuItem disabled text="No results." />}
                onItemSelect={this.handleItemSelect}
                resetOnSelect={true}
                popoverProps={finalPopoverProps}
                disabled={disabled}
            >
                <Button
                    className={classNames(CoreClasses.MINIMAL, targetClassName)}
                    rightIconName="caret-down"
                    text={this.getTargetText()}
                    disabled={disabled}
                />
            </TypedSelect>
        );
    }

    public componentWillReceiveProps(nextProps: ITimezoneInputProps) {
        if (this.props.date.getTime() !== nextProps.date.getTime()) {
            this.timezones = getTimezones(nextProps.date);
        }
        if (this.props.date.getTime() !== nextProps.date.getTime() ||
            this.props.showUserTimezoneGuess !== nextProps.showUserTimezoneGuess) {
            this.initialTimezones = getInitialTimezones(nextProps.date, nextProps.showUserTimezoneGuess);
        }
    }

    private getTargetText(): string {
        const { date, defaultTimezone, targetFormat = TimezoneFormat.OFFSET, placeholder } = this.props;
        const { selectedTimezone } = this.state;
        const timezone = selectedTimezone || defaultTimezone;
        const timezoneExists = timezone && moment.tz.zone(timezone) != null;

        if (timezoneExists) {
            switch (targetFormat) {
                case TimezoneFormat.ABBREVIATION:
                    return moment.tz(date.getTime(), timezone).format("z");
                case TimezoneFormat.NAME:
                    return timezone;
                case TimezoneFormat.OFFSET:
                    return moment.tz(date.getTime(), timezone).format("Z");
                default:
                    assertNever(targetFormat);
            }
        }

        return placeholder;
    }

    private filterTimezones = (query: string, items: ITimezoneWithMetadata[]): ITimezoneWithMetadata[] => {
        if (!query) {
            return this.initialTimezones;
        }

        return items.filter((item) => {
            return item.timezone.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        });
    }

    private renderTimezone = (itemProps: ISelectItemRendererProps<ITimezoneWithMetadata>) => {
        const { showUserTimezoneGuess } = this.props;
        const timezone = itemProps.item;
        const classes = classNames(CoreClasses.MENU_ITEM, CoreClasses.intentClass(), {
            [CoreClasses.ACTIVE]: itemProps.isActive,
            [CoreClasses.INTENT_PRIMARY]: itemProps.isActive,
        });
        const isGuess = showUserTimezoneGuess && timezone.isUserTimezoneGuess;
        const iconName = isGuess
            ? "locate"
            : undefined;
        const text = isGuess
            ? "Current timezone"
            : timezone.timezone + (timezone.abbreviation ? ` (${timezone.abbreviation})` : "");

        return (
            <MenuItem
                key={timezone.timezone}
                className={classes}
                iconName={iconName}
                text={text}
                label={timezone.offsetAsString}
                onClick={itemProps.handleClick}
                shouldDismissPopover={false}
            />
        );
    }

    private handleItemSelect = (timezone: ITimezoneWithMetadata, event?: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ selectedTimezone: timezone.timezone });
        Utils.safeInvoke(this.props.onTimezoneSelect, timezone.timezone, event);
    }
}

function getTimezones(date: Date): ITimezoneWithMetadata[] {
    const timestamp = date.getTime();
    return moment.tz.names().map((timezone) => toTimezoneWithMetadata(timestamp, timezone));
}

function getInitialTimezones(date: Date, includeGuess: boolean): ITimezoneWithMetadata[] {
    const popularTimezones = getPopularTimezones(date);
    const guessedTimezone = includeGuess ? getGuessedTimezone(date) : undefined;
    return guessedTimezone ? [
        guessedTimezone,
        ...popularTimezones.filter((popularTimezone) => popularTimezone.timezone !== guessedTimezone.timezone),
    ] : popularTimezones;
}

function getPopularTimezones(date: Date): ITimezoneWithMetadata[] {
    const timezones = getTimezones(date)
        .filter(({ timezone }) => (
            // Filter out noisy timezones
            // See https://github.com/moment/moment-timezone/issues/227
            /\//.test(timezone) &&
            !/Etc\//.test(timezone)
        ));

    const timezoneToPopulation: { [timezone: string]: number } = {};
    for (const { timezone } of timezones) {
        const zone = moment.tz.zone(timezone);
        const population = (zone && (zone as any).population) || 0;
        timezoneToPopulation[timezone] = population;
    }

    // Order by offset ascending, population descending, timezone name ascending
    timezones.sort((tz1, tz2) => {
        const population1 = timezoneToPopulation[tz1.timezone];
        const population2 = timezoneToPopulation[tz2.timezone];
        if (tz1.offset === tz2.offset) {
            if (population1 === population2) {
                // Fall back to sorting alphabetically
                return tz1.timezone < tz2.timezone ? -1 : 1;
            }
            // Descending order of population
            return population2 - population1;
        }
        // Ascending order of offset
        return tz1.offset - tz2.offset;
    });

    // Choose the most populous locations for each offset
    const initialTimezones: ITimezoneWithMetadata[] = [];
    let curOffset: number;
    for (const timezone of timezones) {
        if (curOffset === undefined || curOffset !== timezone.offset) {
            initialTimezones.push(timezone);
            curOffset = timezone.offset;
        }
    }
    return initialTimezones;
}

function getGuessedTimezone(date: Date): ITimezoneWithMetadata | undefined {
    const timezone = moment.tz.guess();
    return timezone ? toTimezoneWithMetadata(date.getTime(), timezone) : undefined;
}

function toTimezoneWithMetadata(timestamp: number, timezone: string): ITimezoneWithMetadata {
    const zonedDate = moment.tz(timestamp, timezone);
    const offset = zonedDate.utcOffset();
    const offsetAsString = zonedDate.format("Z");
    const abbreviation = getAbbreviation(timestamp, timezone);
    const isUserTimezoneGuess = moment.tz.guess() === timezone;
    return { timezone, abbreviation, offset, offsetAsString, isUserTimezoneGuess };
}

function getAbbreviation(timestamp: number, timezoneName: string): string {
    const zone = moment.tz.zone(timezoneName);
    if (zone) {
        const abbreviation = zone.abbr(timestamp);

        // Only include abbreviations that are not just a repeat of the offset
        if (abbreviation.length > 0 && abbreviation[0] !== "-" && abbreviation[0] !== "+") {
            return abbreviation;
        }
    }

    return "";
}

function assertNever(x: never): never {
    throw new Error("Unexpected value: " + x);
}
