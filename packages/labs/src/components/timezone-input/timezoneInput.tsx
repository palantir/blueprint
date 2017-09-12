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
    Classes as CoreClasses,
    InputGroup,
    IProps,
    Menu,
    MenuItem,
    Utils,
} from "@blueprintjs/core";
import {
    IQueryListRendererProps,
    Popover2,
    QueryList,
} from "..";
import * as Classes from "../../common/classes";

export interface ITimezoneInputProps extends IProps {
    onTimezoneSelect: (timezone: ITimezone | undefined, event?: React.SyntheticEvent<HTMLElement>) => void;
}

export interface ITimezone {
    name: string;
}

export interface ITimezoneInputState {
    activeItem?: ITimezone;
    query?: string;
    isOpen?: boolean;
}

const TypedQueryList = QueryList.ofType<ITimezone>();

@PureRender
export class TimezoneInput extends AbstractComponent<ITimezoneInputProps, ITimezoneInputState> {
    public static displayName = "Blueprint.TimezoneInput";

    public static defaultProps: Partial<ITimezoneInputProps> = {};

    public state: ITimezoneInputState = {
        isOpen: false,
        query: "",
    };

    private queryList: QueryList<ITimezone>;
    private refHandlers = {
        queryList: (ref: QueryList<ITimezone>) => this.queryList = ref,
    };

    private items: ITimezone[] = moment.tz.names().map((name) => ({ name }));

    public render() {
        const { className } = this.props;

        return (
            <TypedQueryList
                className={classNames(Classes.TIMEZONE_INPUT, className)}
                items={this.items}
                activeItem={this.state.activeItem}
                onActiveItemChange={this.handleActiveItemChange}
                onItemSelect={this.handleItemSelect}
                query={this.state.query}
                ref={this.refHandlers.queryList}
                renderer={this.renderQueryList}
            />
        );
    }

    private renderQueryList = (listProps: IQueryListRendererProps<ITimezone>) => {
        const { query, activeItem, isOpen } = this.state;

        return (
            <Popover2
                className={listProps.className}
                popoverClassName={Classes.SELECT_POPOVER}
                placement="bottom-start"
                isOpen={isOpen}
                onInteraction={this.handlePopoverInteraction}
                autoFocus={false}
                enforceFocus={false}
            >
                <InputGroup
                    placeholder="Select a timezone..."
                    value={isOpen ? query : activeItem ? activeItem.name : ""}
                    onChange={this.handleQueryChange}
                    onKeyDown={listProps.handleKeyDown}
                    onKeyUp={listProps.handleKeyUp}
                />

                <Menu ulRef={listProps.itemsParentRef}>
                    {this.renderItems(listProps)}
                </Menu>
            </Popover2>
        );
    }

    private renderItems(listProps: IQueryListRendererProps<ITimezone>) {
        const { activeItem } = this.state;

        return listProps.filteredItems.map((item, index) => {
            const classes = classNames({
                [CoreClasses.ACTIVE]: item === activeItem,
            });
            const handleClick = (event: React.SyntheticEvent<HTMLElement>) => {
                listProps.handleItemSelect(item, event);
            };

            return (
                <MenuItem
                    key={index}
                    className={classes}
                    text={item.name}
                    onClick={handleClick}
                />
            );
        });
    }

    private handleActiveItemChange = (activeItem: ITimezone) => {
        this.setState({ activeItem });
    }

    private handleItemSelect = (item: ITimezone, event?: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ isOpen: false });
        Utils.safeInvoke(this.props.onTimezoneSelect, item, event);
    }

    private handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value;
        this.setState({ query });
    }

    private handlePopoverInteraction = (isOpen: boolean) => {
        this.setState({ isOpen });
    }
}
