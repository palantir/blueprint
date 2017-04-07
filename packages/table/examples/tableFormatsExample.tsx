/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { BaseExample } from "@blueprintjs/docs";

import { Cell, Column, JSONFormat, Table, TruncatedFormat } from "../src";

interface ITimezone {
    name: string;
    offsetMsec: number;
    offsetString: string;
}

const LOCAL_TIMEZONE_OFFSET_MSEC = new Date().getTimezoneOffset() * 60 * 1000;

const TIME_ZONES = [
    ["-12:00", -12.0, "Etc/GMT+12"],
    ["-11:00", -11.0, "Pacific/Midway"],
    ["-10:00", -10.0, "Pacific/Honolulu"],
    ["-09:30", -9.5, "Pacific/Marquesas"],
    ["-09:00", -9.0, "America/Anchorage"],
    ["-08:00", -8.0, "America/Los_Angeles"],
    ["-07:00", -7.0, "America/Denver"],
    ["-06:00", -6.0, "America/Chicago"],
    ["-05:00", -5.0, "America/New_York"],
    ["-04:30", -4.5, "America/Caracas"],
    ["-04:00", -4.0, "America/Puerto_Rico"],
    ["-03:30", -3.5, "America/St_Johns"],
    ["-03:00", -3.0, "America/Buenos_Aires"],
    ["-02:00", -2.0, "America/Noronha"],
    ["-01:00", -1.0, "Atlantic/Azores"],
    ["+00:00", 0.0, "UTC"],
    ["+01:00", 1.0, "Europe/Berlin"],
    ["+02:00", 2.0, "Africa/Cairo"],
    ["+03:00", 3.0, "Asia/Baghdad"],
    ["+04:00", 4.0, "Asia/Dubai"],
    ["+04:30", 4.5, "Asia/Kabul"],
    ["+05:00", 5.0, "Asia/Karachi"],
    ["+05:30", 5.5, "Asia/Kolkata"],
    ["+05:45", 5.75, "Asia/Kathmandu"],
    ["+06:00", 6.0, "Asia/Dhaka"],
    ["+06:30", 6.5, "Asia/Rangoon"],
    ["+07:00", 7.0, "Asia/Bangkok"],
    ["+08:00", 8.0, "Asia/Hong_Kong"],
    ["+08:45", 8.0, "Australia/Eucla"],
    ["+09:00", 9.0, "Asia/Tokyo"],
    ["+09:30", 9.5, "Australia/Darwin"],
    ["+10:00", 10.0, "Australia/Sydney"],
    ["+10:30", 10.5, "Australia/Lord_Howe"],
    ["+11:00", 11.0, "Asia/Magadan"],
    ["+11:30", 11.5, "Pacific/Norfolk"],
    ["+12:00", 12.0, "Pacific/Auckland"],
    ["+12:45", 12.75, "Pacific/Chatham"],
    ["+13:00", 13.0, "Pacific/Tongatapu"],
    ["+14:00", 14.0, "Pacific/Kiritimati"],
].map((arr) => {
    return {
        name: arr[2],
        offsetMsec: (arr[1] as number) * 60 * 60 * 1000 + LOCAL_TIMEZONE_OFFSET_MSEC,
        offsetString: arr[0],
    } as ITimezone;
});

const FORMAT_OPTIONS = {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    second: "2-digit",
    weekday: "long",
    year: "numeric",
};

export interface ITableFormatExampleState {
    children?: any[];
    data?: any[];
}

export class TableFormatsExample extends BaseExample<ITableFormatExampleState> {
    private data = TIME_ZONES;
    private date = new Date();

    public constructor(props?: any, context?: any) {
        super(props, context);
        this.state = {} as ITableFormatExampleState;
    }

    public componentDidMount() {
        const children = [
            <Column key="1" name="Timezone" renderCell={this.renderTimezone} />,
            <Column key="2" name="UTC Offset" renderCell={this.renderOffset} />,
            <Column key="3" name="Local Time" renderCell={this.renderLocalTime} />,
            <Column key="4" name="Timezone JSON" renderCell={this.renderJSON} />,
        ];
        this.setState({ children });
    }

    public render() {
        return (
            <Table
                isRowResizable={true}
                numRows={this.data.length}
                onColumnsReordered={this.handleColumnsReordered}
                onRowsReordered={this.handleRowsReordered}
            >
                {this.state.children}
            </Table>
        );
    }

    private renderTimezone = (row: number) => <Cell>{this.data[row].name}</Cell>;

    private renderOffset = (row: number) => <Cell>{this.data[row].offsetString}</Cell>;

    private renderLocalTime = (row: number) => {
        const localDateTime = new Date(this.date);
        localDateTime.setTime(localDateTime.getTime() + this.data[row].offsetMsec);
        const formattedDateTime = localDateTime.toLocaleString("en-US", FORMAT_OPTIONS);
        return <Cell><TruncatedFormat>{formattedDateTime}</TruncatedFormat></Cell>;
    }

    private renderJSON = (row: number) => <Cell><JSONFormat>{this.data[row]}</JSONFormat></Cell>;

    private handleColumnsReordered = (oldIndex: number, newIndex: number, length: number) => {
        if (oldIndex === newIndex) { return; }
        const nextChildren = reorderElementsInArray(this.state.children, oldIndex, newIndex, length);
        this.setState({ children: nextChildren });
    }

    private handleRowsReordered = (oldIndex: number, newIndex: number, length: number) => {
        if (oldIndex === newIndex) { return; }
        this.data = reorderElementsInArray(this.data, oldIndex, newIndex, length);
        this.forceUpdate();
    }
}

function reorderElementsInArray(array: any[], from: number, to: number, length: number) {
    const before = array.slice(0, from);
    const within = array.slice(from, from + length);
    const after = array.slice(from + length);

    const result = [];
    let i = 0;
    let b = 0;
    let w = 0;
    let a = 0;

    while (i < to) {
        if (b < before.length) {
            result.push(before[b]);
            b += 1;
        } else {
            result.push(after[a]);
            a += 1;
        }
        i += 1;
    }

    while (w < length) {
        result.push(within[w]);
        w += 1;
        i += 1;
    }

    while (i < array.length) {
        if (b < before.length) {
            result.push(before[b]);
            b += 1;
        } else {
            result.push(after[a]);
            a += 1;
        }
        i += 1;
    }

    return result;
}
