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
    date: Date;
    onTimezoneSelect: (timezone: ITimezone | undefined, event?: React.SyntheticEvent<HTMLElement>) => void;
}

export interface ITimezone {
    name: string;
}

export interface ITimezoneInputState {
    selectedItem?: ITimezone;
}

const TimezoneSelect = Select.ofType<ITimezone>();

@PureRender
export class TimezoneInput extends AbstractComponent<ITimezoneInputProps, ITimezoneInputState> {
    public static displayName = "Blueprint.TimezoneInput";

    public static defaultProps: Partial<ITimezoneInputProps> = {};

    public state: ITimezoneInputState = {};

    private items: ITimezone[];
    private initialItems: ITimezone[];

    constructor(props: ITimezoneInputProps, context?: any) {
        super(props, context);

        this.items = getTimezones();
        this.initialItems = getRepresentativeTimezones(props.date);
    }

    public render() {
        const { className } = this.props;
        const { selectedItem } = this.state;

        return (
            <TimezoneSelect
                className={classNames(Classes.TIMEZONE_INPUT, className)}
                items={this.items}
                itemListPredicate={this.filterTimezones}
                itemRenderer={this.renderTimezone}
                noResults={<MenuItem disabled text="No results." />}
                onItemSelect={this.handleItemSelect}
                resetOnSelect={true}
            >
                <Button
                    className={CoreClasses.MINIMAL}
                    rightIconName="caret-down"
                    text={moment.tz(selectedItem ? selectedItem.name : moment.tz.guess()).format("Z")}
                />
            </TimezoneSelect>
        );
    }

    public componentWillReceiveProps(nextProps: ITimezoneInputProps) {
        if (this.props.date.valueOf() !== nextProps.date.valueOf()) {
            this.initialItems = getRepresentativeTimezones(nextProps.date);
        }
    }

    private filterTimezones = (query: string, items: ITimezone[]): ITimezone[] => {
        if (!query) {
            return this.initialItems;
        }

        return items.filter((item) => {
            return item.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        });
    }

    private renderTimezone(itemProps: ISelectItemRendererProps<ITimezone>) {
        const classes = classNames({
            [CoreClasses.ACTIVE]: itemProps.isActive,
            [CoreClasses.INTENT_PRIMARY]: itemProps.isActive,
        });
        const timezone = itemProps.item.name;
        const offset = moment.tz(timezone).format("Z");
        return (
            <MenuItem
                key={timezone}
                className={classes}
                text={timezone}
                label={offset}
                onClick={itemProps.handleClick}
            />
        );
    }

    private handleItemSelect = (item: ITimezone, event?: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ selectedItem: item });
        Utils.safeInvoke(this.props.onTimezoneSelect, item, event);
    }
}

function getTimezones(): ITimezone[] {
    return moment.tz.names().map((name) => ({ name }));
}

function getRepresentativeTimezones(date: Date): ITimezone[] {
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

    return offsetZones.map(({ name }) => ({ name }));
}
