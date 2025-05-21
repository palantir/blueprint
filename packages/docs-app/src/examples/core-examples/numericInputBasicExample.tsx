/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { capitalize } from "lodash";
import * as React from "react";

import {
    Button,
    Divider,
    FormGroup,
    H5,
    Intent,
    Menu,
    MenuItem,
    NumericInput,
    type NumericInputProps,
    type OptionProps,
    Popover,
    type Size,
    Switch,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";
import { Dropdown } from "@blueprintjs/select";

import { IntentSelect } from "./common/intentSelect";
import { LOCALES } from "./common/locales";
import { SizeSelect } from "./common/sizeSelect";

const LOCALE_OPTIONS: Array<OptionProps<string>> = [{ label: "Default", value: "default" }, ...LOCALES];

export const NumericInputBasicExample: React.FC<ExampleProps> = props => {
    const [allowNumericCharactersOnly, setAllowNumericCharactersOnly] = React.useState(true);
    const [buttonPosition, setButtonPosition] = React.useState<NumericInputProps["buttonPosition"]>("right");
    const [disabled, setDisabled] = React.useState(false);
    const [fill, setFill] = React.useState(false);
    const [intent, setIntent] = React.useState<Intent>(Intent.NONE);
    const [leftElement, setLeftElement] = React.useState(false);
    const [leftIcon, setLeftIcon] = React.useState(false);
    const [locale, setLocale] = React.useState<OptionProps<string>>(LOCALE_OPTIONS[0]);
    const [max, setMax] = React.useState(100);
    const [min, setMin] = React.useState(0);
    const [selectAllOnFocus, setSelectAllOnFocus] = React.useState(false);
    const [selectAllOnIncrement, setSelectAllOnIncrement] = React.useState(false);
    const [size, setSize] = React.useState<Size>("medium");
    const [value, setValue] = React.useState("");

    const handleInputValueChange = React.useCallback(
        (_valueAsNumber: number, valueAsString: string) => setValue(valueAsString),
        [],
    );

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            <Switch checked={fill} label="Fill" onChange={handleBooleanChange(setFill)} />
            <Switch checked={leftIcon} label="Left icon" onChange={handleBooleanChange(setLeftIcon)} />
            <Switch checked={leftElement} label="Left element" onChange={handleBooleanChange(setLeftElement)} />
            <Switch
                checked={allowNumericCharactersOnly}
                label="Numeric characters only"
                onChange={handleBooleanChange(setAllowNumericCharactersOnly)}
            />
            <Switch
                checked={selectAllOnFocus}
                label="Select all on focus"
                onChange={handleBooleanChange(setSelectAllOnFocus)}
            />
            <Switch
                checked={selectAllOnIncrement}
                label="Select all on increment"
                onChange={handleBooleanChange(setSelectAllOnIncrement)}
            />
            <Divider />
            <FormGroup label="Minimum value">
                <Dropdown
                    fill={true}
                    itemLabel={getValueLabel}
                    items={[-Infinity, -10, 0, 20]}
                    onItemSelect={setMin}
                    selectedItem={min}
                />
            </FormGroup>
            <FormGroup label="Maximum value">
                <Dropdown
                    fill={true}
                    itemLabel={getValueLabel}
                    items={[Infinity, 20, 50, 100]}
                    onItemSelect={setMax}
                    selectedItem={max}
                />
            </FormGroup>
            <FormGroup label="Button position">
                <Dropdown
                    itemLabel={capitalize}
                    items={["none", "left", "right"]}
                    onItemSelect={setButtonPosition}
                    selectedItem={buttonPosition}
                />
            </FormGroup>
            <IntentSelect intent={intent} onChange={setIntent} />
            <FormGroup label="Locale">
                <Dropdown
                    fill={true}
                    itemKey="value"
                    itemLabel="label"
                    items={LOCALE_OPTIONS}
                    onItemSelect={setLocale}
                    selectedItem={locale}
                />
            </FormGroup>
            <SizeSelect onChange={setSize} size={size} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <NumericInput
                allowNumericCharactersOnly={allowNumericCharactersOnly}
                buttonPosition={buttonPosition}
                disabled={disabled}
                fill={fill}
                intent={intent}
                leftElement={leftElement ? <FilterMenu /> : undefined}
                leftIcon={leftIcon ? IconNames.DOLLAR : undefined}
                locale={locale.value === "default" ? undefined : locale.value}
                max={max}
                min={min}
                onValueChange={handleInputValueChange}
                placeholder="Enter a number..."
                size={size}
                selectAllOnFocus={selectAllOnFocus}
                selectAllOnIncrement={selectAllOnIncrement}
                value={value}
            />
        </Example>
    );
};

const FilterMenu: React.FC = () => (
    <Popover
        position="bottom"
        content={
            <Menu>
                <MenuItem icon={IconNames.Equals} text="Equals" />
                <MenuItem icon={IconNames.LessThan} text="Less than" />
                <MenuItem icon={IconNames.GreaterThan} text="Greater than" />
            </Menu>
        }
    >
        <Button icon={IconNames.Filter} variant="minimal" />
    </Popover>
);

function getValueLabel(value: number | undefined) {
    if (isFinite(value)) {
        return value;
    } else {
        return "None";
    }
}
