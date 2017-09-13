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
     * Format to use when rendering the selected (or default) timezone.
     * Only affects the target, not anything in the dropdown list.
     * @default TimezoneFormat.OFFSET
     */
    selectedTimezoneFormat?: TimezoneFormat;

    /**
     * Whether this input is non-interactive.
     * @default false
     */
    disabled?: boolean;

    showUserTimezoneGuess?: boolean; // TODO
    popoverProps?: Partial<IPopoverProps> & object; // TODO
    placeholder?: string; // TODO
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

interface ITimezone {
    name: string;
    abbreviation: string;
    offset: number;
    offsetAsString: string;
}

const TimezoneSelect = Select.ofType<ITimezone>();

@PureRender
export class TimezoneInput extends AbstractComponent<ITimezoneInputProps, ITimezoneInputState> {
    public static displayName = "Blueprint.TimezoneInput";

    public state: ITimezoneInputState = {};

    private timezones: ITimezone[];
    private initialTimezones: ITimezone[];

    constructor(props: ITimezoneInputProps, context?: any) {
        super(props, context);

        this.timezones = getTimezones(props.date);
        this.initialTimezones = getInitialTimezones(props.date);
    }

    public render() {
        const { className, disabled } = this.props;

        return (
            <TimezoneSelect
                className={classNames(Classes.TIMEZONE_INPUT, className)}
                items={this.timezones}
                itemListPredicate={this.filterTimezones}
                itemRenderer={this.renderTimezone}
                noResults={<MenuItem disabled text="No results." />}
                onItemSelect={this.handleItemSelect}
                resetOnSelect={true}
                popoverProps={{ popoverClassName: Classes.TIMEZONE_INPUT_POPOVER }}
                disabled={disabled}
            >
                <Button
                    className={CoreClasses.MINIMAL}
                    rightIconName="caret-down"
                    text={this.getSelectedTimezoneDisplayText() || "Select a timezone"}
                    disabled={disabled}
                />
            </TimezoneSelect>
        );
    }

    public componentWillReceiveProps(nextProps: ITimezoneInputProps) {
        if (this.props.date.getTime() !== nextProps.date.getTime()) {
            this.timezones = getTimezones(nextProps.date);
            this.initialTimezones = getInitialTimezones(nextProps.date);
        }
    }

    private getSelectedTimezoneDisplayText(): string | undefined {
        const { date, selectedTimezoneFormat = TimezoneFormat.OFFSET, defaultTimezone } = this.props;
        const { selectedTimezone } = this.state;
        const timestamp = date.getTime();
        const timezone = selectedTimezone || defaultTimezone;
        const timezoneExists = timezone && moment.tz.zone(timezone) != null;

        if (timezoneExists) {
            switch (selectedTimezoneFormat) {
                case TimezoneFormat.ABBREVIATION:
                    return moment.tz(timestamp, timezone).format("z");
                case TimezoneFormat.NAME:
                    return timezone;
                case TimezoneFormat.OFFSET:
                    return moment.tz(timestamp, timezone).format("Z");
                default:
                    assertNever(selectedTimezoneFormat);
            }
        }

        return undefined;
    }

    private filterTimezones = (query: string, items: ITimezone[]): ITimezone[] => {
        if (!query) {
            return this.initialTimezones;
        }

        return items.filter((item) => {
            return item.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        });
    }

    private renderTimezone(itemProps: ISelectItemRendererProps<ITimezone>) {
        const timezone = itemProps.item;
        const classes = classNames(CoreClasses.MENU_ITEM, CoreClasses.intentClass(), {
            [CoreClasses.ACTIVE]: itemProps.isActive,
            [CoreClasses.INTENT_PRIMARY]: itemProps.isActive,
        });

        return (
            <MenuItem
                key={timezone.name}
                className={classes}
                label={timezone.offsetAsString}
                text={timezone.name + (timezone.abbreviation ? ` (${timezone.abbreviation})` : "")}
                onClick={itemProps.handleClick}
                shouldDismissPopover={false}
            />
        );
    }

    private handleItemSelect = (timezone: ITimezone, event?: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ selectedTimezone: timezone.name });
        Utils.safeInvoke(this.props.onTimezoneSelect, timezone.name, event);
    }
}

function getTimezones(date: Date): ITimezone[] {
    return moment.tz.names().map((name) => createTimezone(date.getTime(), name));
}

function getInitialTimezones(date: Date): ITimezone[] {
    interface IZoneWithMeta {
        name: string;
        offset: number;
        offsetStr: string;
        population: number;
    }

    const zones: IZoneWithMeta[] = moment.tz.names()
        .filter((name) => (
            // https://github.com/moment/moment-timezone/issues/227
            /\//.test(name) &&
            !/Etc\//.test(name)
        ))
        .map((name) => {
            const zone = moment.tz.zone(name);
            const zonedDate = moment.tz(date, name);

            const offset = zonedDate.utcOffset();
            const offsetStr = zonedDate.format("Z");

            const population = (zone as any).population || 0;

            return { name, offset, offsetStr, population };
        });

    const zonesByOffset: { [offset: string]: IZoneWithMeta[] } = {};
    for (const zone of zones) {
        zonesByOffset[zone.offsetStr] = zonesByOffset[zone.offsetStr] || [];
        zonesByOffset[zone.offsetStr].push(zone);
    }

    const offsetZones: IZoneWithMeta[] = [];
    for (const offset of Object.keys(zonesByOffset)) {
        if (zonesByOffset[offset].length > 0) {
            zonesByOffset[offset].sort((tz1, tz2) => {
                if (tz1.population === tz2.population) {
                    return tz1.name < tz2.name ? -1 : 1;
                }
                return tz2.population - tz1.population;
            });

            offsetZones.push(zonesByOffset[offset][0]);
        }
    }

    offsetZones.sort((tz1, tz2) => tz1.offset - tz2.offset);

    return offsetZones.map(({ name }) => createTimezone(date.getTime(), name));
}

function createTimezone(timestamp: number, timezoneName: string): ITimezone {
    const zonedDate = moment.tz(timestamp, timezoneName);
    const offset = zonedDate.utcOffset();
    const offsetAsString = zonedDate.format("Z");
    const abbreviation = getAbbreviation(timestamp, timezoneName);
    return {
        name: timezoneName,
        abbreviation,
        offset,
        offsetAsString,
    };
}

function getAbbreviation(timestamp: number, timezoneName: string): string {
    const zone = moment.tz.zone(timezoneName);
    if (zone) {
        const abbreviation = zone.abbr(timestamp);
        if (abbreviation.length > 0 && abbreviation[0] !== "-" && abbreviation[0] !== "+") {
            return abbreviation;
        }
    }

    return "";
}

function assertNever(x: never): never {
    throw new Error("Unexpected value: " + x);
}
