/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { useCallback } from "react";

import { Button, Code, MenuItem } from "@blueprintjs/core";
import { Flex } from "@blueprintjs/labs";
import { type ItemRenderer, Select } from "@blueprintjs/select";

interface FontWeightSelectProps {
    /** The currently selected font weight */
    value: number;
    /** Callback when the weight is changed */
    onChange: (weight: number) => void;
}

const fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];

const weightLabels: Record<number, string> = {
    100: "Thin",
    200: "Extra Light",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "Semi Bold",
    700: "Bold",
    800: "Extra Bold",
    900: "Black",
};

function areFontWeightsEqual(a: number, b: number): boolean {
    return a === b;
}

export function FontWeightSelect({ value, onChange }: FontWeightSelectProps) {
    const handleItemSelect = useCallback(
        (weight: number) => {
            onChange(weight);
        },
        [onChange],
    );

    const itemRenderer = useCallback<ItemRenderer<number>>(
        (weight, props) => {
            if (!props.modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    active={props.modifiers.active}
                    disabled={props.modifiers.disabled}
                    key={weight}
                    onClick={props.handleClick}
                    onFocus={props.handleFocus}
                    roleStructure="listoption"
                    selected={weight === value}
                    style={{ fontWeight: weight }}
                    text={`${weight} - ${weightLabels[weight]}`}
                />
            );
        },
        [value],
    );

    return (
        <Flex>
            <Select<number>
                filterable={false}
                itemRenderer={itemRenderer}
                items={fontWeights}
                itemsEqual={areFontWeightsEqual}
                onItemSelect={handleItemSelect}
                popoverProps={{ matchTargetWidth: true, minimal: true }}
            >
                <Button
                    alignText="start"
                    endIcon="caret-down"
                    fill={true}
                    text={<Code>{`${value} - ${weightLabels[value]}`}</Code>}
                    style={{ minWidth: "200px" }}
                />
            </Select>
        </Flex>
    );
}
