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

import { useCallback, useState } from "react";

import {
    BLUEPRINT_BP7_THEME,
    BLUEPRINT_THEME_V1_SCHEMA_URL,
    type BlueprintThemeColorScheme,
    BlueprintThemeProvider,
    type BlueprintThemeV1,
    SegmentedControl,
} from "@blueprintjs/core";

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
import { NHS_DIGITAL_THEME } from "./NhsDigitalTheme";
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
import { ThemeExample } from "./ThemeExample";
import { ToastExample } from "./ToastExample";
import { TooltipExample } from "./TooltipExample";
import { TreeExample } from "./TreeExample";

export const Examples: React.FC = () => {
    return (
        <div className="examples-root">
            <ExamplesContainer paneLabel="Left" />
            <ExamplesContainer paneLabel="Right" />
        </div>
    );
};

Examples.displayName = "DemoApp.Examples";

type ThemeId = "bp6" | "bp7" | "nhs";

// The provider inherits stable BP6 CSS, so an empty document represents BP6 and partial themes such as NHS layer over it.
const BP6_THEME: BlueprintThemeV1 = {
    $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
    components: {},
    tokens: {},
};

const THEME_OPTIONS = [
    { label: "BP6", value: "bp6" },
    { label: "BP7", value: "bp7" },
    { label: "NHS", value: "nhs" },
];

const THEME_NAMES = {
    bp6: "BP6",
    bp7: "BP7",
    nhs: "NHS Digital",
} as const satisfies Record<ThemeId, string>;

const COLOR_SCHEME_OPTIONS = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
];

interface ExamplesContainerProps {
    readonly paneLabel: string;
}

const ExamplesContainer: React.FC<ExamplesContainerProps> = ({ paneLabel }) => {
    const [themeId, setThemeId] = useState<ThemeId>("bp6");
    const [colorScheme, setColorScheme] = useState<BlueprintThemeColorScheme>("light");
    const isNhsTheme = themeId === "nhs";
    const theme = isNhsTheme ? NHS_DIGITAL_THEME : themeId === "bp7" ? BLUEPRINT_BP7_THEME : BP6_THEME;
    const themeName = THEME_NAMES[themeId];
    const handleThemeChange = useCallback((nextThemeId: string) => {
        if (!isThemeId(nextThemeId)) {
            return;
        }

        setThemeId(nextThemeId);
        if (nextThemeId === "nhs") {
            // NHS Digital publishes only a light theme, so entering it resets rather than inventing a dark palette.
            setColorScheme("light");
        }
    }, []);
    const handleColorSchemeChange = useCallback((value: string) => {
        setColorScheme(value === "dark" ? "dark" : "light");
    }, []);

    const controls = (
        <div className="theme-controls">
            <div className="theme-control">
                <strong>Theme</strong>
                <SegmentedControl
                    aria-label={`${paneLabel} theme`}
                    onValueChange={handleThemeChange}
                    options={THEME_OPTIONS}
                    value={themeId}
                />
            </div>
            <div className="theme-control">
                <strong>Color scheme</strong>
                <SegmentedControl
                    aria-label={`${paneLabel} color scheme`}
                    disabled={isNhsTheme}
                    onValueChange={handleColorSchemeChange}
                    options={COLOR_SCHEME_OPTIONS}
                    value={colorScheme}
                />
            </div>
        </div>
    );

    const examples = (
        <div className="examples-container">
            <ThemeExample
                authoredButtonFontSize={isNhsTheme ? "0.875rem" : undefined}
                colorScheme={colorScheme}
                themeName={themeName}
            />
            <BoxExample />
            <BreadcrumbExample />
            <ButtonExample />
            <ButtonGroupExample />
            <CalloutExample />
            <CollapseExample />
            <CheckboxRadioExample />
            <DatePickerExample />
            <DateRangePickerExample />
            <DialogExample />
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

    return (
        <div className="examples-theme-pane">
            <div className="examples-container">
                {controls}
                <BlueprintThemeProvider colorScheme={colorScheme} theme={theme}>
                    {examples}
                </BlueprintThemeProvider>
            </div>
        </div>
    );
};

ExamplesContainer.displayName = "DemoApp.ExamplesContainer";

function isThemeId(value: string): value is ThemeId {
    return value === "bp6" || value === "bp7" || value === "nhs";
}
