/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { capitalize } from "lodash";
import * as React from "react";

import { Button, ButtonGroup, FormGroup, Intent } from "@blueprintjs/core";
import { Dropdown } from "@blueprintjs/select";

const INTENTS: Intent[] = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER];

export interface IntentSelectProps {
    intent: Intent;
    label?: React.ReactNode;
    onChange: (intent: Intent) => void;
    /** @default false */
    showClearButton?: boolean;
}

export const IntentSelect: React.FC<IntentSelectProps> = ({
    label = "Intent",
    intent = "none",
    showClearButton,
    onChange,
}) => {
    const handleClear = React.useCallback(() => onChange("none"), [onChange]);
    return (
        <FormGroup label={label}>
            <ButtonGroup fill={true}>
                <Dropdown fill={true} items={INTENTS} itemLabel={capitalize} onItemSelect={onChange} selectedItem={intent} />
                {showClearButton && (
                    <Button aria-label="Clear" disabled={intent === "none"} icon="cross" onClick={handleClear} />
                )}
            </ButtonGroup>
        </FormGroup>
    );
};
