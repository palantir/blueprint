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
    Divider,
    H5,
    Icon,
    InputGroup,
    Intent,
    Menu,
    MenuItem,
    Popover,
    Spinner,
    Switch,
    Tag,
    Tooltip,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";
import { IconSize } from "@blueprintjs/icons";

import { IntentSelect } from "./common/intentSelect";

export interface InputGroupExampleState {
    disabled: boolean;
    filterValue: string;
    intent: Intent;
    large: boolean;
    readOnly: boolean;
    showPassword: boolean;
    small: boolean;
    tagValue: string;
}

export class InputGroupExample extends React.PureComponent<ExampleProps, InputGroupExampleState> {
    public state: InputGroupExampleState = {
        disabled: false,
        filterValue: "",
        intent: Intent.NONE,
        large: false,
        readOnly: false,
        showPassword: false,
        small: false,
        tagValue: "",
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));

    private handleIntentChange = (intent: Intent) => this.setState({ intent });

    private handleReadOnlyChange = handleBooleanChange(readOnly => this.setState({ readOnly }));

    private handleLargeChange = handleBooleanChange(large => this.setState({ large, ...(large && { small: false }) }));

    private handleSmallChange = handleBooleanChange(small => this.setState({ small, ...(small && { large: false }) }));

    private handleFilterChange = handleStringChange(filterValue =>
        window.setTimeout(() => this.setState({ filterValue }), 10),
    );

    private handleTagChange = handleStringChange(tagValue => this.setState({ tagValue }));

    public render() {
        const { disabled, filterValue, intent, large, readOnly, small, showPassword, tagValue } = this.state;

        const maybeSpinner = filterValue ? <Spinner size={IconSize.STANDARD} /> : undefined;

        const lockButton = (
            <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`} disabled={disabled}>
                <Button
                    disabled={disabled}
                    icon={showPassword ? "unlock" : "lock"}
                    intent={Intent.WARNING}
                    minimal={true}
                    onClick={this.handleLockClick}
                />
            </Tooltip>
        );

        const permissionsMenu = (
            <Popover
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
            </Popover>
        );

        const resultsTag = <Tag minimal={true}>{Math.floor(10000 / Math.max(1, Math.pow(tagValue.length, 2)))}</Tag>;

        const sharedProps = { disabled, intent, large, readOnly, small };

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <Tooltip content="My input value state is updated asynchronously with a 10ms delay">
                    <InputGroup
                        {...sharedProps}
                        asyncControl={true}
                        leftIcon="filter"
                        onChange={this.handleFilterChange}
                        placeholder="Filter histogram..."
                        rightElement={maybeSpinner}
                        value={filterValue}
                    />
                </Tooltip>
                <InputGroup
                    {...sharedProps}
                    placeholder="Enter your password..."
                    rightElement={lockButton}
                    type={showPassword ? "text" : "password"}
                />
                <InputGroup
                    {...sharedProps}
                    leftElement={<Icon icon="tag" />}
                    onChange={this.handleTagChange}
                    placeholder="Find tags"
                    rightElement={resultsTag}
                    value={tagValue}
                />
                <InputGroup {...sharedProps} placeholder="Add people or groups..." rightElement={permissionsMenu} />
            </Example>
        );
    }

    private renderOptions() {
        const { disabled, intent, readOnly, large, small } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch label="Disabled" onChange={this.handleDisabledChange} checked={disabled} />
                <Switch label="Read-only" onChange={this.handleReadOnlyChange} checked={readOnly} />
                <Switch label="Large" onChange={this.handleLargeChange} checked={large} />
                <Switch label="Small" onChange={this.handleSmallChange} checked={small} />
                <Divider />
                <IntentSelect intent={intent} onChange={this.handleIntentChange} />
            </>
        );
    }

    private handleLockClick = () => this.setState({ showPassword: !this.state.showPassword });
}
