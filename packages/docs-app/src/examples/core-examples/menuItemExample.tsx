/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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
    Classes,
    Code,
    FormGroup,
    H5,
    type Intent,
    Menu,
    MenuItem,
    type MenuItemProps,
    SegmentedControl,
    Switch,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

import { BooleanOrUndefinedSelect } from "./common/booleanOrUndefinedSelect";
import { IntentSelect } from "./common/intentSelect";

export function MenuItemExample(props: ExampleProps) {
    const [active, setActive] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [selected, setSelected] = React.useState<boolean | undefined>(undefined);
    const [intent, setIntent] = React.useState<Intent>("none");
    const [iconEnabled, setIconEnabled] = React.useState(true);
    const [submenuEnabled, setSubmenuEnabled] = React.useState(true);
    const [roleStructure, setRoleStructure] = React.useState<MenuItemProps["roleStructure"]>("menuitem");

    const handleRoleStructureChange = React.useCallback(
        (newValue: string) => setRoleStructure(newValue as MenuItemProps["roleStructure"]),
        [],
    );

    const isSelectable = roleStructure === "listoption";

    const options = (
        <>
            <H5>Props</H5>
            <Switch label="Active" checked={active} onChange={handleBooleanChange(setActive)} />
            <Switch label="Disabled" checked={disabled} onChange={handleBooleanChange(setDisabled)} />
            <PropCodeTooltip
                content={
                    isSelectable ? undefined : (
                        <>
                            <Code>selected</Code> prop has no effect when <br />
                            <Code>roleStructure="menuitem"</Code>
                        </>
                    )
                }
                disabled={isSelectable}
            >
                <BooleanOrUndefinedSelect
                    disabled={!isSelectable}
                    label="Selected"
                    value={selected}
                    onChange={setSelected}
                />
            </PropCodeTooltip>
            <Switch label="Enable icon" checked={iconEnabled} onChange={handleBooleanChange(setIconEnabled)} />
            <Switch label="Enable submenu" checked={submenuEnabled} onChange={handleBooleanChange(setSubmenuEnabled)} />
            <IntentSelect intent={intent} onChange={setIntent} showClearButton={true} />
            <FormGroup label="Role structure">
                <SegmentedControl
                    options={[
                        { label: "menuitem", value: "menuitem" },
                        { label: "listoption", value: "listoption" },
                    ]}
                    onValueChange={handleRoleStructureChange}
                    small={true}
                    value={roleStructure}
                />
            </FormGroup>
        </>
    );

    return (
        <Example className="docs-menu-example" options={options} {...props}>
            <Menu className={Classes.ELEVATION_1}>
                <MenuItem
                    active={active}
                    disabled={disabled}
                    icon={iconEnabled ? "applications" : undefined}
                    intent={intent}
                    labelElement={submenuEnabled ? undefined : "⌘,"}
                    roleStructure={roleStructure}
                    selected={selected}
                    text="Applications"
                    children={
                        submenuEnabled ? (
                            <>
                                <MenuItem icon="add" text="Add new application" />
                                <MenuItem icon="remove" text="Remove application" />
                            </>
                        ) : undefined
                    }
                />
            </Menu>
        </Example>
    );
}
