/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { Callout, Intent, useHotkeys } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";

interface ModifierCalloutProps {
    combo: string;
    label: string;
    onTriggered: () => void;
    isTriggered: boolean;
}

const ModifierCallout = ({ combo, label, onTriggered, isTriggered }: ModifierCalloutProps) => {
    const { handleKeyDown, handleKeyUp } = useHotkeys([
        {
            combo,
            global: true,
            group: "Modifier Example",
            label,
            onKeyDown: onTriggered,
        },
    ]);

    return (
        <Callout
            intent={isTriggered ? Intent.SUCCESS : Intent.PRIMARY}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
        >
            {label}
        </Callout>
    );
};

export const HotkeyModifierExample = (props: ExampleProps) => {
    const [triggeredKeys, setTriggeredKeys] = React.useState<Set<string>>(new Set());

    const handleKeyTriggered = React.useCallback((combo: string) => {
        setTriggeredKeys(prev => new Set(prev).add(combo));
        // Clear the checkmark after 1 second
        setTimeout(() => {
            setTriggeredKeys(prev => {
                const next = new Set(prev);
                next.delete(combo);
                return next;
            });
        }, 1000);
    }, []);

    return (
        <Example options={false} {...props}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <ModifierCallout
                    combo="b"
                    label="Press B"
                    onTriggered={() => handleKeyTriggered("b")}
                    isTriggered={triggeredKeys.has("b")}
                />
                <ModifierCallout
                    combo="ctrl + b"
                    label="Press Ctrl+B"
                    onTriggered={() => handleKeyTriggered("ctrl + b")}
                    isTriggered={triggeredKeys.has("ctrl + b")}
                />
                <ModifierCallout
                    combo="shift + b"
                    label="Press Shift+B"
                    onTriggered={() => handleKeyTriggered("shift + b")}
                    isTriggered={triggeredKeys.has("shift + b")}
                />
                <ModifierCallout
                    combo="alt + b"
                    label="Press Alt+B"
                    onTriggered={() => handleKeyTriggered("alt + b")}
                    isTriggered={triggeredKeys.has("alt + b")}
                />
                <ModifierCallout
                    combo="meta + b"
                    label="Press Cmd/Meta+B"
                    onTriggered={() => handleKeyTriggered("meta + b")}
                    isTriggered={triggeredKeys.has("meta + b")}
                />
                <ModifierCallout
                    combo="shift + 1"
                    label="Press Shift+1"
                    onTriggered={() => handleKeyTriggered("shift + 1")}
                    isTriggered={triggeredKeys.has("shift + 1")}
                />
            </div>
        </Example>
    );
};
