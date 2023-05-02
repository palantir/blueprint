/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

export type Layout = "horizontal" | "vertical";

export interface LayoutSelectProps {
    layout: Layout;
    onChange: (size: Layout) => void;
}

/** Button radio group to switch between horizontal and vertical layouts. */
export const LayoutSelect: React.FC<LayoutSelectProps> = ({ layout, onChange }) => {
    const handleVertical = React.useCallback(() => onChange("vertical"), []);
    const handleHorizontal = React.useCallback(() => onChange("horizontal"), []);

    return (
        <Label>
            Layout
            <ButtonGroup fill={true} style={{ marginTop: 5 }}>
                <Button active={layout === "vertical"} text="Vertical" onClick={handleVertical} />
                <Button active={layout === "horizontal"} text="Horizontal" onClick={handleHorizontal} />
            </ButtonGroup>
        </Label>
    );
};
