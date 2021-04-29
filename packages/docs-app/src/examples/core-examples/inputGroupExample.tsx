/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";

import {
    Button,
    H5,
    Icon,
    IconSize,
    InputGroup,
    Intent,
    Menu,
    MenuItem,
    Spinner,
    Switch,
    Tag,
} from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";

export interface IInputGroupExampleState {
    disabled: boolean;
    filterValue: string;
    large: boolean;
    small: boolean;
    showPassword: boolean;
    tagValue: string;
}

export class InputGroupExample extends React.PureComponent<IExampleProps, IInputGroupExampleState> {
    public state: IInputGroupExampleState = {
        disabled: false,
        filterValue: "",
        large: false,
        showPassword: false,
        small: false,
        tagValue: "",
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));

    private handleLargeChange = handleBooleanChange(large => this.setState({ large, ...(large && { small: false }) }));

    private handleSmallChange = handleBooleanChange(small => this.setState({ small, ...(small && { large: false }) }));

    private handleFilterChange = handleStringChange(filterValue =>
        window.setTimeout(() => this.setState({ filterValue }), 10),
    );

    private handleTagChange = handleStringChange(tagValue => this.setState({ tagValue }));

    public render() {
        const { disabled, filterValue, large, small, showPassword, tagValue } = this.state;

        const maybeSpinner = filterValue ? <Spinner size={IconSize.STANDARD} /> : undefined;

        const lockButton = (
            <Tooltip2 content={`${showPassword ? "Hide" : "Show"} Password`} disabled={disabled}>
                <Button
                    disabled={disabled}
                    icon={showPassword ? "unlock" : "lock"}
                    intent={Intent.WARNING}
                    minimal={true}
                    onClick={this.handleLockClick}
                />
            </Tooltip2>
        );

        const permissionsMenu = (
            <Popover2
                content={
                    <Menu>
                        <MenuItem text="can edit" />
                        <MenuItem text="can view" />
                    </Menu>
                }
                disabled={disabled}
                placement="bottom-end"
            >
                <Button disabled={disabled} minimal={true} rightIcon="caret-down">
                    can edit
                </Button>
            </Popover2>
        );

        const resultsTag = <Tag minimal={true}>{Math.floor(10000 / Math.max(1, Math.pow(tagValue.length, 2)))}</Tag>;

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <Tooltip2 content="My input value state is updated asynchronously with a 10ms delay">
                    <InputGroup
                        asyncControl={true}
                        disabled={disabled}
                        large={large}
                        leftIcon="filter"
                        onChange={this.handleFilterChange}
                        placeholder="Filter histogram..."
                        rightElement={maybeSpinner}
                        small={small}
                        value={filterValue}
                    />
                </Tooltip2>
                <InputGroup
                    disabled={disabled}
                    large={large}
                    placeholder="Enter your password..."
                    rightElement={lockButton}
                    small={small}
                    type={showPassword ? "text" : "password"}
                />
                <InputGroup
                    disabled={disabled}
                    large={large}
                    leftElement={<Icon icon="tag" />}
                    onChange={this.handleTagChange}
                    placeholder="Find tags"
                    rightElement={resultsTag}
                    small={small}
                    value={tagValue}
                />
                <InputGroup
                    disabled={disabled}
                    large={large}
                    placeholder="Add people or groups..."
                    rightElement={permissionsMenu}
                    small={small}
                />
            </Example>
        );
    }

    private renderOptions() {
        const { disabled, large, small } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch label="Disabled" onChange={this.handleDisabledChange} checked={disabled} />
                <Switch label="Large" onChange={this.handleLargeChange} checked={large} />
                <Switch label="Small" onChange={this.handleSmallChange} checked={small} />
            </>
        );
    }

    private handleLockClick = () => this.setState({ showPassword: !this.state.showPassword });
}
