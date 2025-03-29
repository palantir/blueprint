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

import { useCallback, useState } from "react";

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
    type Size,
    Spinner,
    Switch,
    Tag,
    Tooltip,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";
import { IconNames, IconSize } from "@blueprintjs/icons";

import { IntentSelect } from "./common/intentSelect";
import { SizeSelect } from "./common/sizeSelect";

export const InputGroupExample: React.FC<ExampleProps> = props => {
    const [disabled, setDisabled] = useState(false);
    const [intent, setIntent] = useState<Intent>(Intent.NONE);
    const [readOnly, setReadOnly] = useState(false);
    const [size, setSize] = useState<Size>("medium");

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            <Switch checked={readOnly} label="Read-only" onChange={handleBooleanChange(setReadOnly)} />
            <Divider />
            <SizeSelect onChange={setSize} size={size} />
            <IntentSelect intent={intent} onChange={setIntent} />
        </>
    );

    const inputGroupProps: InputGroupProps = { disabled, intent, readOnly, size };

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
    const [filterValue, setFilterValue] = useState("");

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
    const [showPassword, setShowPassword] = useState(false);

    const handleLockClick = useCallback(() => setShowPassword(value => !value), []);

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
                        onClick={handleLockClick}
                        variant="minimal"
                    />
                </Tooltip>
            }
            type={showPassword ? "text" : "password"}
        />
    );
};

const TagInputGroup: React.FC<InputGroupProps> = props => {
    const [tagValue, setTagValue] = useState("");

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
                <Button disabled={props.disabled} endIcon={IconNames.CARET_DOWN} variant="minimal">
                    can edit
                </Button>
            </Popover>
        }
    />
);
