/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable sort-keys */

import { useState } from "react";

import { Button, Code, Colors, Divider, Popover } from "@blueprintjs/core";
import { Flex } from "@blueprintjs/labs";

interface ColorPickerProps {
    /** The currently selected color (hex string) */
    value: string;
    /** Callback when a color is selected */
    onChange: (color: string) => void;
}

// Create a reverse mapping from hex values to color names
const colorNameMap: Record<string, string> = {};
Object.entries(Colors).forEach(([name, value]) => {
    colorNameMap[value] = name;
});

// Convert color name to kebab-case format like $black, $dark-gray1
function formatColorName(colorName: string): string {
    return "$" + colorName.toLowerCase().replace(/_/g, "-");
}

// Organize colors by category
const colorCategories = [
    {
        name: "Grayscale",
        colors: [
            { name: "Black", shades: [Colors.BLACK] },
            {
                name: "Dark Gray",
                shades: [Colors.DARK_GRAY1, Colors.DARK_GRAY2, Colors.DARK_GRAY3, Colors.DARK_GRAY4, Colors.DARK_GRAY5],
            },
            { name: "Gray", shades: [Colors.GRAY1, Colors.GRAY2, Colors.GRAY3, Colors.GRAY4, Colors.GRAY5] },
            {
                name: "Light Gray",
                shades: [
                    Colors.LIGHT_GRAY1,
                    Colors.LIGHT_GRAY2,
                    Colors.LIGHT_GRAY3,
                    Colors.LIGHT_GRAY4,
                    Colors.LIGHT_GRAY5,
                ],
            },
            { name: "White", shades: [Colors.WHITE] },
        ],
    },
    {
        name: "Core Colors",
        colors: [
            { name: "Blue", shades: [Colors.BLUE1, Colors.BLUE2, Colors.BLUE3, Colors.BLUE4, Colors.BLUE5] },
            { name: "Green", shades: [Colors.GREEN1, Colors.GREEN2, Colors.GREEN3, Colors.GREEN4, Colors.GREEN5] },
            {
                name: "Orange",
                shades: [Colors.ORANGE1, Colors.ORANGE2, Colors.ORANGE3, Colors.ORANGE4, Colors.ORANGE5],
            },
            { name: "Red", shades: [Colors.RED1, Colors.RED2, Colors.RED3, Colors.RED4, Colors.RED5] },
        ],
    },
    {
        name: "Extended Colors",
        colors: [
            {
                name: "Cerulean",
                shades: [Colors.CERULEAN1, Colors.CERULEAN2, Colors.CERULEAN3, Colors.CERULEAN4, Colors.CERULEAN5],
            },
            {
                name: "Forest",
                shades: [Colors.FOREST1, Colors.FOREST2, Colors.FOREST3, Colors.FOREST4, Colors.FOREST5],
            },
            { name: "Gold", shades: [Colors.GOLD1, Colors.GOLD2, Colors.GOLD3, Colors.GOLD4, Colors.GOLD5] },
            {
                name: "Indigo",
                shades: [Colors.INDIGO1, Colors.INDIGO2, Colors.INDIGO3, Colors.INDIGO4, Colors.INDIGO5],
            },
            { name: "Lime", shades: [Colors.LIME1, Colors.LIME2, Colors.LIME3, Colors.LIME4, Colors.LIME5] },
            { name: "Rose", shades: [Colors.ROSE1, Colors.ROSE2, Colors.ROSE3, Colors.ROSE4, Colors.ROSE5] },
            { name: "Sepia", shades: [Colors.SEPIA1, Colors.SEPIA2, Colors.SEPIA3, Colors.SEPIA4, Colors.SEPIA5] },
            {
                name: "Turquoise",
                shades: [Colors.TURQUOISE1, Colors.TURQUOISE2, Colors.TURQUOISE3, Colors.TURQUOISE4, Colors.TURQUOISE5],
            },
            {
                name: "Vermilion",
                shades: [Colors.VERMILION1, Colors.VERMILION2, Colors.VERMILION3, Colors.VERMILION4, Colors.VERMILION5],
            },
            {
                name: "Violet",
                shades: [Colors.VIOLET1, Colors.VIOLET2, Colors.VIOLET3, Colors.VIOLET4, Colors.VIOLET5],
            },
        ],
    },
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const colorName = colorNameMap[value];
    const formattedName = colorName ? formatColorName(colorName) : value;
    const displayText = (
        <Flex gap={1}>
            <Code>{formattedName}</Code>
            <Divider />
            <Code>{value}</Code>
        </Flex>
    );

    const handleColorSelect = (color: string) => {
        onChange(color);
        setIsOpen(false);
    };

    return (
        <Popover
            content={
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        padding: "16px",
                    }}
                >
                    {colorCategories.map(category => (
                        <div key={category.name}>
                            <div style={{ color: "#5C7080", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
                                {category.name}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {category.colors.map(colorGroup => (
                                    <div
                                        key={colorGroup.name}
                                        style={{ alignItems: "center", display: "flex", gap: "8px" }}
                                    >
                                        <div style={{ color: "#8A9BA8", fontSize: "11px", minWidth: "60px" }}>
                                            {colorGroup.name}
                                        </div>
                                        <div style={{ display: "flex", gap: "4px" }}>
                                            {colorGroup.shades.map(color => {
                                                const name = colorNameMap[color];
                                                const formattedTooltip = name
                                                    ? `${formatColorName(name)} ${color}`
                                                    : color;
                                                return (
                                                    <button
                                                        key={color}
                                                        onClick={() => handleColorSelect(color)}
                                                        style={{
                                                            backgroundColor: color,
                                                            border:
                                                                value === color
                                                                    ? "2px solid #2D72D2"
                                                                    : "1px solid #CED9E0",
                                                            borderRadius: "4px",
                                                            cursor: "pointer",
                                                            height: "24px",
                                                            padding: 0,
                                                            width: "24px",
                                                        }}
                                                        title={formattedTooltip}
                                                        type="button"
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            }
            isOpen={isOpen}
            onInteraction={setIsOpen}
            placement="bottom-start"
        >
            <Button
                icon={
                    <div
                        style={{
                            backgroundColor: value,
                            border: "1px solid #CED9E0",
                            borderRadius: "3px",
                            height: "16px",
                            width: "16px",
                        }}
                    />
                }
                endIcon="caret-down"
                text={displayText}
                style={{ minWidth: "200px" }}
            />
        </Popover>
    );
}
