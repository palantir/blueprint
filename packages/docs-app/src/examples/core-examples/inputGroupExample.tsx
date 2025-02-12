/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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
    type InputGroupProps,
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
import { IconNames, IconSize } from "@blueprintjs/icons";

import { IntentSelect } from "./common/intentSelect";

export const InputGroupExample: React.FC<ExampleProps> = props => {
    const [disabled, setDisabled] = React.useState(false);
    const [intent, setIntent] = React.useState<Intent>(Intent.NONE);
    const [large, setLarge] = React.useState(false);
    const [readOnly, setReadOnly] = React.useState(false);
    const [small, setSmall] = React.useState(false);

    const handleLargeChange = handleBooleanChange(newLarge => {
        setLarge(newLarge);
        if (newLarge) {
            setSmall(false);
        }
    });

    const handleSmallChange = handleBooleanChange(newSmall => {
        setSmall(newSmall);
        if (newSmall) {
            setLarge(false);
        }
    });

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            <Switch checked={readOnly} label="Read-only" onChange={handleBooleanChange(setReadOnly)} />
            <Switch checked={large} label="Large" onChange={handleLargeChange} />
            <Switch checked={small} label="Small" onChange={handleSmallChange} />
            <Divider />
            <IntentSelect intent={intent} onChange={setIntent} />
        </>
    );

    const inputGroupProps: InputGroupProps = { disabled, intent, large, readOnly, small };

    return (
        <Example options={options} {...props}>
            <AsyncInputGroup {...inputGroupProps} />
            <PasswordInputGroup {...inputGroupProps} />
            <TagInputGroup {...inputGroupProps} />
            <PopoverInputGroup {...inputGroupProps} />
        </Example>
    );
};

const AsyncInputGroup: React.FC<InputGroupProps> = props => {
    const [filterValue, setFilterValue] = React.useState("");

    const handleFilterChange = handleStringChange(value => window.setTimeout(() => setFilterValue(value), 10));

    return (
        <Tooltip content="My input value state is updated asynchronously with a 10ms delay">
            <InputGroup
                {...props}
                asyncControl={true}
                leftIcon={IconNames.FILTER}
                onChange={handleFilterChange}
                placeholder="Filter histogram..."
                rightElement={filterValue && <Spinner size={IconSize.STANDARD} />}
                value={filterValue}
            />
        </Tooltip>
    );
};

const PasswordInputGroup: React.FC<InputGroupProps> = props => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleLockClick = React.useCallback(() => setShowPassword(value => !value), []);

    return (
        <InputGroup
            {...props}
            placeholder="Enter your password..."
            rightElement={
                <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`} disabled={props.disabled}>
                    <Button
                        disabled={props.disabled}
                        icon={showPassword ? "unlock" : "lock"}
                        intent={Intent.WARNING}
                        minimal={true}
                        onClick={handleLockClick}
                    />
                </Tooltip>
            }
            type={showPassword ? "text" : "password"}
        />
    );
};

const TagInputGroup: React.FC<InputGroupProps> = props => {
    const [tagValue, setTagValue] = React.useState("");

    return (
        <InputGroup
            {...props}
            leftElement={<Icon icon="tag" />}
            onChange={handleStringChange(setTagValue)}
            placeholder="Find tags"
            rightElement={<Tag minimal={true}>{Math.floor(10000 / Math.max(1, Math.pow(tagValue.length, 2)))}</Tag>}
            value={tagValue}
        />
    );
};

const PopoverInputGroup: React.FC<InputGroupProps> = props => (
    <InputGroup
        {...props}
        placeholder="Add people or groups..."
        rightElement={
            <Popover
                content={
                    <Menu>
                        <MenuItem text="can edit" />
                        <MenuItem text="can view" />
                    </Menu>
                }
                disabled={props.disabled}
                placement="bottom-end"
            >
                <Button disabled={props.disabled} minimal={true} rightIcon={IconNames.CARET_DOWN}>
                    can edit
                </Button>
            </Popover>
        }
    />
);
