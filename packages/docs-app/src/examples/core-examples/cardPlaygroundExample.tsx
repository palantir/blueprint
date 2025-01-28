/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { Button, Card, Classes, Elevation, FormGroup, H5, Slider, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

const MAX_ELEVATION = 4;

export const CardPlaygroundExample: React.FC<ExampleProps> = props => {
    const [compact, setCompact] = React.useState(false);
    const [elevation, setElevation] = React.useState<Elevation>(Elevation.ZERO);
    const [interactive, setInteractive] = React.useState(false);
    const [selected, setSelected] = React.useState(false);

    const handleElevationChange = React.useCallback((value: number) => setElevation(value as Elevation), []);

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={interactive} label="Interactive" onChange={handleBooleanChange(setInteractive)} />
            <Switch
                checked={interactive && selected}
                disabled={!interactive}
                label="Selected"
                onChange={handleBooleanChange(setSelected)}
            />
            <Switch checked={compact} label="Compact" onChange={handleBooleanChange(setCompact)} />
            <FormGroup label="Elevation">
                <Slider
                    handleHtmlProps={{ "aria-label": "card elevation" }}
                    max={MAX_ELEVATION}
                    onChange={handleElevationChange}
                    showTrackFill={false}
                    value={elevation}
                />
            </FormGroup>
        </>
    );

    return (
        <Example options={options} {...props}>
            <Card compact={compact} elevation={elevation} interactive={interactive} selected={selected}>
                <H5>Analytical applications</H5>
                <p>
                    User interfaces that enable people to interact smoothly with data, ask better questions, and make
                    better decisions.
                </p>
                <Button text="Explore products" className={Classes.BUTTON} />
            </Card>
        </Example>
    );
};
