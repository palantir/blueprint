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

import * as React from "react";

import { Button, ButtonGroup, Label } from "@blueprintjs/core";

export type Size = "small" | "regular" | "large";

export interface SizeSelectProps {
    size: Size;
    onChange: (size: Size) => void;
}

export const SizeSelect: React.FC<SizeSelectProps> = ({ size, onChange }) => {
    const handleSmall = React.useCallback(() => onChange("small"), []);
    const handleRegular = React.useCallback(() => onChange("regular"), []);
    const handleLarge = React.useCallback(() => onChange("large"), []);

    return (
        <Label>
            Size
            <ButtonGroup fill={true} style={{ marginTop: 5 }}>
                <Button active={size === "small"} text="Small" onClick={handleSmall} />
                <Button active={size === "regular"} text="Regular" onClick={handleRegular} />
                <Button active={size === "large"} text="Large" onClick={handleLarge} />
            </ButtonGroup>
        </Label>
    );
};
