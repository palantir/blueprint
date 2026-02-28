/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { useCallback } from "react";

import { Button, Code, MenuItem } from "@blueprintjs/core";
import { Flex } from "@blueprintjs/labs";
import { type ItemRenderer, Select } from "@blueprintjs/select";

interface FontFamilySelectProps {
    /** The currently selected font family */
    value: string | undefined;
    /** Callback when the font family is changed */
    onChange: (family: string | undefined) => void;
}

interface FontFamilyOption {
    displayName: string;
    cssValue: string | undefined;
}

const fontFamilies: FontFamilyOption[] = [
    {
        cssValue:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, blueprint-icons-16, sans-serif",
        displayName: "Default",
    },
    { cssValue: '"Source Sans 3", sans-serif', displayName: "Source Sans 3" },
    { cssValue: '"Inter", sans-serif', displayName: "Inter" },
    { cssValue: '"JetBrains Mono", monospace', displayName: "JetBrains Mono" },
];

function areFontFamiliesEqual(a: FontFamilyOption, b: FontFamilyOption): boolean {
    return a.cssValue === b.cssValue;
}

export function FontFamilySelect({ value, onChange }: FontFamilySelectProps) {
    const selectedFont = fontFamilies.find(font => font.cssValue === value) ?? fontFamilies[0];

    const handleItemSelect = useCallback(
        (font: FontFamilyOption) => {
            onChange(font.cssValue);
        },
        [onChange],
    );

    const itemRenderer = useCallback<ItemRenderer<FontFamilyOption>>(
        (font, props) => {
            if (!props.modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    active={props.modifiers.active}
                    disabled={props.modifiers.disabled}
                    key={font.displayName}
                    onClick={props.handleClick}
                    onFocus={props.handleFocus}
                    roleStructure="listoption"
                    selected={font.cssValue === value}
                    style={{ fontFamily: font.cssValue }}
                    text={font.displayName}
                />
            );
        },
        [value],
    );

    return (
        <Flex>
            <Select<FontFamilyOption>
                filterable={false}
                itemRenderer={itemRenderer}
                items={fontFamilies}
                itemsEqual={areFontFamiliesEqual}
                onItemSelect={handleItemSelect}
                popoverProps={{ matchTargetWidth: true, minimal: true }}
            >
                <Button
                    alignText="start"
                    endIcon="caret-down"
                    fill={true}
                    text={<Code>{selectedFont.displayName}</Code>}
                    style={{ minWidth: "200px" }}
                />
            </Select>
        </Flex>
    );
}
