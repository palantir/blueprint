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

import classNames from "classnames";
import { useCallback, useState } from "react";

import { BlueprintProvider, Classes, H4, Switch, type ThemeAPI, useBlueprintTheme } from "@blueprintjs/core";

import { BoxExample } from "./BoxExample";
import { BreadcrumbExample } from "./BreadcrumbExample";
import { ButtonExample } from "./ButtonExample";
import { ButtonGroupExample } from "./ButtonGroupExample";
import { CalloutExample } from "./CalloutExample";
import { CheckboxRadioExample } from "./CheckboxRadioExample";
import { CollapseExample } from "./CollapseExample";
import { DatePickerExample } from "./DatePickerExample";
import { DateRangePickerExample } from "./DateRangePickerExample";
import { DialogExample } from "./DialogExample";
import { EditableTextExample } from "./EditableTextExample";
import { EntityTitleExample } from "./EntityTitleExample";
import { HtmlCodeExample } from "./HtmlCodeExample";
import { HtmlTableExample } from "./HtmlTableExample";
import { IconExample } from "./IconExample";
import { InputExample } from "./InputExample";
import { MenuExample } from "./MenuExample";
import { NonIdealStateExample } from "./NonIdealStateExample";
import { PopoverExample } from "./PopoverExample";
import { SliderExample } from "./SliderExample";
import { SpinnerExample } from "./SpinnerExample";
import { SwitchExample } from "./SwitchExample";
import { TableExample } from "./TableExample";
import { TabsExample } from "./TabsExample";
import { TagExample } from "./TagExample";
import { TagInputExample } from "./TagInputExample";
import { TextExample } from "./TextExample";
import { ToastExample } from "./ToastExample";
import { TooltipExample } from "./TooltipExample";
import { TreeExample } from "./TreeExample";

const CUSTOM_THEME: ThemeAPI = {
    borderRadius: "16px",
    fontFamily: "Courier New",
    version: 1,
};

export const Examples: React.FC = () => {
    const [enabled, setEnabled] = useState(false);
    const toggleTheme = useCallback(() => setEnabled(value => !value), []);

    return (
        <div>
            <div className="theme-override-panel">
                <H4>Theme Overrides Example</H4>
                <Switch checked={enabled} label="Enable custom theme" onChange={toggleTheme} />
            </div>
            <div className="examples-panel">
                <BlueprintProvider theme={enabled ? CUSTOM_THEME : undefined}>
                    <ExamplesContainer />
                    <ExamplesContainer isDark={true} />
                </BlueprintProvider>
            </div>
        </div>
    );
};

Examples.displayName = "DemoApp.Examples";

const ExamplesContainer: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
    const themeOverrides = useBlueprintTheme();
    const className = isDark ? Classes.DARK : undefined;
    return (
        <div style={themeOverrides} className={classNames("examples-container", className)}>
            <BoxExample />
            <BreadcrumbExample />
            <ButtonExample />
            <ButtonGroupExample />
            <CalloutExample />
            <CollapseExample />
            <CheckboxRadioExample />
            <DatePickerExample />
            <DateRangePickerExample />
            <DialogExample className={className} />
            <EditableTextExample />
            <EntityTitleExample />
            <HtmlCodeExample />
            <HtmlTableExample />
            <IconExample />
            <InputExample />
            <MenuExample />
            <NonIdealStateExample />
            <PopoverExample />
            <SliderExample />
            <SpinnerExample />
            <SwitchExample />
            <TableExample />
            <TabsExample />
            <TagExample />
            <TagInputExample />
            <TextExample />
            <ToastExample />
            <TooltipExample />
            <TreeExample />
        </div>
    );
};

ExamplesContainer.displayName = "DemoApp.ExamplesContainer";
