/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { memo, useLayoutEffect, useRef, useState } from "react";

import { type BlueprintThemeColorScheme, Button, InputGroup, Menu, MenuItem, PopoverNext } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

const POPOVER_MENU = (
    <Menu>
        <MenuItem icon="style" text="Portaled theme" />
        <MenuItem icon="moon" text="Scheme-aware tokens" />
    </Menu>
);

export interface ThemeExampleProps {
    readonly authoredButtonFontSize?: string;
    readonly colorScheme: BlueprintThemeColorScheme;
    readonly themeName: string;
}

export const ThemeExample = memo(function ThemeExampleFn({
    authoredButtonFontSize,
    colorScheme,
    themeName,
}: ThemeExampleProps) {
    const [computedFontSize, setComputedFontSize] = useState("measuring");
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Measure before paint so the checkpoint never flashes an unmeasured value after provider styles apply.
    useLayoutEffect(
        function measureAuthoredRemValue() {
            if (buttonRef.current !== null) {
                setComputedFontSize(getComputedStyle(buttonRef.current).fontSize);
            }
        },
        [colorScheme, themeName],
    );

    return (
        <div className="example-row">
            <ExampleCard
                label={`${themeName} (${colorScheme})`}
                subLabel={
                    authoredButtonFontSize === undefined
                        ? `Computed button font size: ${computedFontSize}`
                        : `Authored ${authoredButtonFontSize} → computed ${computedFontSize}`
                }
                width={320}
            >
                <Button ref={buttonRef} icon="style" intent="primary" text="Scoped button" />
                <InputGroup
                    aria-label="Structured input radius"
                    leftIcon="search"
                    placeholder="Structured input radius"
                />
                <PopoverNext content={POPOVER_MENU} defaultIsOpen={true} placement="bottom-start">
                    <Button endIcon="caret-down" text="Portaled popover" />
                </PopoverNext>
            </ExampleCard>
        </div>
    );
});
