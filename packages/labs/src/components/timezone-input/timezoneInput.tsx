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

    private items: ITimezone[] = moment.tz.names().map((name) => ({ name }));

    public render() {
        const { className } = this.props;
        const { selectedItem } = this.state;

        return (
            <TimezoneSelect
                className={classNames(Classes.TIMEZONE_INPUT, className)}
                items={this.items}
                itemPredicate={this.filterTimezones}
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

    private filterTimezones(query: string, timezone: ITimezone) {
        return timezone.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
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
