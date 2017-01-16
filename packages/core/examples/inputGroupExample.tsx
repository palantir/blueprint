/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

// tslint:disable-next-line:max-line-length
import * as React from "react";

import {
    Button,
    Classes,
    InputGroup,
    Intent,
    Menu,
    MenuItem,
    Popover,
    Position,
    Switch,
    Tag,
    Tooltip,
} from "@blueprintjs/core";
import BaseExample, { handleBooleanChange, handleStringChange } from "./common/baseExample";

export interface IInputGroupExampleState {
    disabled?: boolean;
    filterValue?: string;
    large?: boolean;
    showPassword?: boolean;
    tagValue?: string;
}

export class InputGroupExample extends BaseExample<IInputGroupExampleState> {
    public state: IInputGroupExampleState = {
        filterValue: "",
        large: false,
        showPassword: false,
        tagValue: "",
    };

    private handleDisabledChange = handleBooleanChange((disabled) => this.setState({ disabled }));
    private handleLargeChange = handleBooleanChange((large) => this.setState({ large }));
    private handleFilterChange = handleStringChange((filterValue) => this.setState({ filterValue }));
    private handleTagChange = handleStringChange((tagValue) => this.setState({ tagValue }));

    protected renderExample() {
        const { disabled, filterValue, large, showPassword, tagValue } = this.state;

        const clearButton = (
            <Button
                className={Classes.MINIMAL}
                disabled={disabled}
                iconName="cross"
                onClick={this.clearFilter}
                style={{ display: filterValue ? "block" : "none" }}
            />
        );

        const lockButton = (
            <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`} isDisabled={disabled}>
                <Button
                    className={Classes.MINIMAL}
                    intent={Intent.WARNING}
                    disabled={disabled}
                    iconName={showPassword ? "unlock" : "lock"}
                    onClick={this.handleLockClick}
                />
            </Tooltip>
        );

        const permissionsMenu = (
            <Popover
                content={<Menu><MenuItem text="can edit" /><MenuItem text="can view" /></Menu>}
                isDisabled={disabled}
                position={Position.BOTTOM_RIGHT}
            >
                <Button className={Classes.MINIMAL} disabled={disabled} rightIconName="caret-down">can edit</Button>
            </Popover>
        );

        const resultsTag = (
            <Tag className={Classes.MINIMAL}>
                {Math.floor(10000 / Math.max(1, Math.pow(tagValue.length, 2)))}
            </Tag>
        );

        return (
            <div>
                <div>
                    <InputGroup
                        className={className}
                        disabled={disabled}
                        leftIconName="filter"
                        onChange={this.handleFilterChange}
                        placeholder="Filter histogram..."
                        rightElement={clearButton}
                        value={filterValue}
                    />
                    <InputGroup
                        className={className}
                        disabled={disabled}
                        placeholder="Enter your password..."
                        rightElement={lockButton}
                        type={showPassword ? "text" : "password"}
                    />
                </div>
                <div>
                    <InputGroup
                        className={className}
                        disabled={disabled}
                        leftIconName="tag"
                        onChange={this.handleTagChange}
                        placeholder="Find tags"
                        rightElement={resultsTag}
                        value={tagValue}
                    />
                    <InputGroup
                        className={className}
                        disabled={disabled}
                        placeholder="Add people or groups..."
                        rightElement={permissionsMenu}
                    />
                </div>
            </div>
        );
    }

    protected renderOptions() {
        const { disabled, large } = this.state;
        return [
            [
                <Switch key="disabled" label="Disabled" onChange={this.handleDisabledChange} checked={disabled} />,
                <Switch key="large" label="Large" onChange={this.handleLargeChange} checked={large} />,
            ],
        ];
    }

    private handleLockClick = () => this.setState({ showPassword: !this.state.showPassword });

    private clearFilter = () => this.setState({ filterValue: "" });
}
