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

import { useCallback, useState } from "react";

import {
    Button,
    Divider,
    FormGroup,
    H5,
    HTMLSelect,
    Intent,
    Menu,
    MenuItem,
    NumericInput,
    type NumericInputProps,
    type OptionProps,
    Popover,
    Position,
    type Size,
    Switch,
} from "@blueprintjs/core";
import {
    Example,
    type ExampleProps,
    handleBooleanChange,
    handleNumberChange,
    handleStringChange,
    handleValueChange,
} from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

import { IntentSelect } from "./common/intentSelect";
import { LOCALES } from "./common/locales";
import { SizeSelect } from "./common/sizeSelect";

const MIN_VALUES = [
    { label: "None", value: -Infinity },
    { label: "-10", value: -10 },
    { label: "0", value: 0 },
    { label: "20", value: 20 },
];

const MAX_VALUES = [
    { label: "None", value: +Infinity },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
];

const BUTTON_POSITIONS = [
    { label: "None", value: "none" },
    { label: "Left", value: Position.LEFT },
    { label: "Right", value: Position.RIGHT },
];

const LOCALE_OPTIONS = [{ label: "Default", value: "default" }, ...LOCALES];

export const NumericInputBasicExample: React.FC<ExampleProps> = props => {
    const [allowNumericCharactersOnly, setAllowNumericCharactersOnly] = useState(true);
    const [buttonPosition, setButtonPosition] =
        useState<NumericInputProps["buttonPosition"]>("right");
    const [disabled, setDisabled] = useState(false);
    const [fill, setFill] = useState(false);
    const [intent, setIntent] = useState<Intent>(Intent.NONE);
    const [leftElement, setLeftElement] = useState(false);
    const [leftIcon, setLeftIcon] = useState(false);
    const [locale, setLocale] = useState<string>();
    const [max, setMax] = useState(100);
    const [min, setMin] = useState(0);
    const [selectAllOnFocus, setSelectAllOnFocus] = useState(false);
    const [selectAllOnIncrement, setSelectAllOnIncrement] = useState(false);
    const [size, setSize] = useState<Size>("medium");
    const [value, setValue] = useState("");

    const handleInputValueChange = useCallback(
        (_valueAsNumber: number, valueAsString: string) => setValue(valueAsString),
        [],
    );

    const handleLocaleChange = handleStringChange(newLocale =>
        setLocale(newLocale === "default" ? undefined : newLocale),
    );

    const options = (
        <>
            <H5>Props</H5>
            <Switch
                checked={disabled}
                label="Disabled"
                onChange={handleBooleanChange(setDisabled)}
            />
            <Switch checked={fill} label="Fill" onChange={handleBooleanChange(setFill)} />
            <Switch
                checked={leftIcon}
                label="Left icon"
                onChange={handleBooleanChange(setLeftIcon)}
            />
            <Switch
                checked={leftElement}
                label="Left element"
                onChange={handleBooleanChange(setLeftElement)}
            />
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
            <SelectMenu
                label="Minimum value"
                onChange={handleNumberChange(setMin)}
                options={MIN_VALUES}
                value={min}
            />
            <SelectMenu
                label="Maximum value"
                onChange={handleNumberChange(setMax)}
                options={MAX_VALUES}
                value={max}
            />
            <SelectMenu
                label="Button position"
                onChange={handleValueChange(setButtonPosition)}
                options={BUTTON_POSITIONS}
                value={buttonPosition}
            />
            <IntentSelect intent={intent} onChange={setIntent} />
            <SelectMenu
                label="Locale"
                onChange={handleLocaleChange}
                options={LOCALE_OPTIONS}
                value={locale}
            />
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

interface SelectMenuProps {
    label: string;
    onChange: React.FormEventHandler;
    options: OptionProps[];
    value: number | string;
}

const SelectMenu: React.FC<SelectMenuProps> = ({ label, onChange, options, value }) => (
    <FormGroup label={label}>
        <HTMLSelect onChange={onChange} options={options} value={value} />
    </FormGroup>
);
