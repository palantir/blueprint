/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, H5, Intent, Menu, MenuItem, Switch } from "@blueprintjs/core";
import { Example, ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { IntentSelect } from "./common/intentSelect";
import { Size, SizeSelect } from "./common/sizeSelect";

export function MenuItemExample(props: ExampleProps) {
    const [size, setSize] = React.useState<Size>("regular");
    const [disabled, setDisabled] = React.useState(false);
    const [selected, setSelected] = React.useState(false);
    const [intent, setIntent] = React.useState<Intent>("none");
    const [iconEnabled, setIconEnabled] = React.useState(true);
    const [tickEnabled, setTickEnabled] = React.useState(true);
    const [submenuEnabled, setSubmenuEnabled] = React.useState(false);

    const options = (
        <>
            <H5>Props</H5>
            <SizeSelect size={size} onChange={setSize} />
            <Switch label="Disabled" checked={disabled} onChange={handleBooleanChange(setDisabled)} />
            <Switch label="Selected" checked={selected} onChange={handleBooleanChange(setSelected)} />
            <Switch label="Enable icon" checked={iconEnabled} onChange={handleBooleanChange(setIconEnabled)} />
            <Switch label="Enable submenu" checked={submenuEnabled} onChange={handleBooleanChange(setSubmenuEnabled)} />
            <Switch label="Enable tick" checked={tickEnabled} onChange={handleBooleanChange(setTickEnabled)} />
            <IntentSelect intent={intent} onChange={setIntent} />
        </>
    );

    return (
        <Example className="docs-menu-example" options={options} {...props}>
            <Menu className={Classes.ELEVATION_1} large={size === "large"} small={size === "small"}>
                <MenuItem
                    disabled={disabled}
                    text="Show hidden items"
                    icon={iconEnabled ? "eye-open" : undefined}
                    intent={intent}
                    labelElement={submenuEnabled ? undefined : "⌘,"}
                    indent={tickEnabled && selected}
                    children={
                        submenuEnabled ? (
                            <>
                                <MenuItem icon="add" text="Add new application" />
                                <MenuItem icon="remove" text="Remove application" />
                            </>
                        ) : undefined
                    }
                />
                <MenuItem
                    disabled={disabled}
                    text="Enable debug mode"
                    icon={iconEnabled ? "bug" : undefined}
                    intent={intent}
                    labelElement={submenuEnabled ? undefined : "⌘,"}
                    indent={tickEnabled && selected}
                    showTick={tickEnabled && selected}
                    selected={selected}
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
