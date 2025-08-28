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

import { useCallback, useState } from "react";

import { Code, getKeyComboString, KeyComboTag } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";

export const HotkeyTesterExample: React.FC<ExampleProps> = props => {
    const [combo, setCombo] = useState<string | null>(null);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setCombo(getKeyComboString(event.nativeEvent));
    }, []);

    const handleBlur = useCallback(() => setCombo(null), []);

    return (
        <Example options={false} {...props}>
            <div
                className="docs-hotkey-tester"
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                tabIndex={0}
            >
                {combo == null ? (
                    "Click here then press a key combo"
                ) : (
                    <>
                        <KeyComboTag combo={combo} />
                        <KeyComboTag combo={combo} minimal={true} />
                        <Code>{combo}</Code>
                    </>
                )}
            </div>
        </Example>
    );
};
