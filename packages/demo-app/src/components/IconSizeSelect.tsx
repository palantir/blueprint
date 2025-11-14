/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { useCallback } from "react";

import { Button, Code, MenuItem } from "@blueprintjs/core";
import { Flex } from "@blueprintjs/labs";
import { type ItemRenderer, Select } from "@blueprintjs/select";

interface IconSizeSelectProps {
    /** The currently selected icon size in pixels */
    value: number;
    /** Callback when the size is changed */
    onChange: (size: number) => void;
}

const iconSizes = [12, 16, 20, 24, 32, 48, 64, 96, 128];

function areIconSizesEqual(a: number, b: number): boolean {
    return a === b;
}

export function IconSizeSelect({ value, onChange }: IconSizeSelectProps) {
    const handleItemSelect = useCallback(
        (size: number) => {
            onChange(size);
        },
        [onChange],
    );

    const itemRenderer = useCallback<ItemRenderer<number>>(
        (size, props) => {
            return (
                <MenuItem
                    active={props.modifiers.active}
                    disabled={props.modifiers.disabled}
                    key={size}
                    onClick={props.handleClick}
                    onFocus={props.handleFocus}
                    roleStructure="listoption"
                    selected={size === value}
                    text={`${size}px`}
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
                items={iconSizes}
                itemsEqual={areIconSizesEqual}
                onItemSelect={handleItemSelect}
                popoverProps={{ matchTargetWidth: true, minimal: true }}
            >
                <Button
                    endIcon="caret-down"
                    text={<Code>{`${value}px`}</Code>}
                    fill={true}
                    alignText="start"
                    style={{ minWidth: "200px" }}
                />
            </Select>
        </Flex>
    );
}
