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

import { Classes, Code, H5, HTMLSelect, Intent, Label, Menu, Switch } from "@blueprintjs/core";
import { Example, ExampleProps, handleBooleanChange, handleValueChange } from "@blueprintjs/docs-theme";
import { MenuItem2, MenuItem2Props } from "@blueprintjs/popover2";

import { PropCodeTooltip } from "../../common/propCodeTooltip";
import { IntentSelect } from "../core-examples/common/intentSelect";
import { Size, SizeSelect } from "../core-examples/common/sizeSelect";
import { BooleanOrUndefinedSelect } from "./booleanOrUndefinedSelect";

export function MenuItem2Example(props: ExampleProps) {
    const [size, setSize] = React.useState<Size>("regular");
    const [active, setActive] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [selected, setSelected] = React.useState<boolean | undefined>(undefined);
    const [intent, setIntent] = React.useState<Intent>("none");
    const [iconEnabled, setIconEnabled] = React.useState(true);
    const [submenuEnabled, setSubmenuEnabled] = React.useState(true);
    const [roleStructure, setRoleStructure] = React.useState<MenuItem2Props["roleStructure"]>("menuitem");

    const isSelectedOptionAvailable = roleStructure === "listoption";

    const options = (
        <>
            <H5>Menu props</H5>
            <SizeSelect size={size} onChange={setSize} />

            <H5>MenuItem2 props</H5>
            <Switch label="Active" checked={active} onChange={handleBooleanChange(setActive)} />
            <Switch label="Disabled" checked={disabled} onChange={handleBooleanChange(setDisabled)} />
            <PropCodeTooltip
                content={
                    isSelectedOptionAvailable ? undefined : (
                        <>
                            <Code>selected</Code> prop has no effect when <br />
                            <Code>roleStructure="menuitem"</Code> is set
                        </>
                    )
                }
            >
                <BooleanOrUndefinedSelect
                    disabled={!isSelectedOptionAvailable}
                    label="Selected"
                    value={selected}
                    onChange={setSelected}
                />
            </PropCodeTooltip>
            <Switch label="Enable icon" checked={iconEnabled} onChange={handleBooleanChange(setIconEnabled)} />
            <Switch label="Enable submenu" checked={submenuEnabled} onChange={handleBooleanChange(setSubmenuEnabled)} />
            <IntentSelect intent={intent} onChange={setIntent} showClearButton={true} />
            <Label>
                Role structure
                <HTMLSelect
                    options={["menuitem", "listoption"]}
                    value={roleStructure}
                    onChange={handleValueChange(setRoleStructure)}
                />
            </Label>
        </>
    );

    return (
        <Example className="docs-menu-example" options={options} {...props}>
            <Menu className={Classes.ELEVATION_1} large={size === "large"} small={size === "small"}>
                <MenuItem2
                    active={active}
                    disabled={disabled}
                    icon={iconEnabled ? "cog" : undefined}
                    intent={intent}
                    labelElement={submenuEnabled ? undefined : "⌘,"}
                    roleStructure={roleStructure}
                    selected={selected}
                    text="Settings"
                    children={
                        submenuEnabled ? (
                            <>
                                <MenuItem2 icon="add" text="Add new application" />
                                <MenuItem2 icon="remove" text="Remove application" />
                            </>
                        ) : undefined
                    }
                />
            </Menu>
        </Example>
    );
}
