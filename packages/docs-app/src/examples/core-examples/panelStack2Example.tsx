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

import React, { useCallback, useState } from "react";

import { Button, H5, Intent, Panel, PanelProps, NumericInput, PanelStack2, Switch, UL } from "@blueprintjs/core";
import { Example, handleBooleanChange, ExampleProps } from "@blueprintjs/docs-theme";

interface PanelExampleInfo {
    panelNumber: number;
}

const PanelExample: React.FC<PanelProps<PanelExampleInfo>> = props => {
    const [counter, setCounter] = useState(0);
    const openNewPanel = useCallback(() => {
        const panelNumber = props.panelNumber + 1;
        props.openPanel({
            props: { panelNumber },
            renderPanel: PanelExample,
            title: `Panel ${panelNumber}`,
        });
        // eslint-disable-next-line @typescript-eslint/unbound-method
    }, [props.panelNumber, props.openPanel]);

    return (
        <div className="docs-panel-stack-contents-example">
            <Button intent={Intent.PRIMARY} onClick={openNewPanel} text="Open new panel" />
            <NumericInput value={counter} stepSize={1} onValueChange={setCounter} />
        </div>
    );
};

const initialPanel: Panel<PanelExampleInfo> = {
    props: {
        panelNumber: 1,
    },
    renderPanel: PanelExample,
    title: "Panel 1",
};

export const PanelStack2Example: React.FC<ExampleProps> = props => {
    const [activePanelOnly, setActivePanelOnly] = useState(true);
    const [showHeader, setShowHeader] = useState(true);
    const [currentPanelStack, setCurrentPanelStack] = useState([initialPanel]);

    const toggleActiveOnly = useCallback(handleBooleanChange(setActivePanelOnly), []);
    const toggleShowHeader = useCallback(handleBooleanChange(setShowHeader), []);
    const addToPanelStack = useCallback(
        (newPanel: Panel<PanelExampleInfo>) => setCurrentPanelStack(stack => [newPanel, ...stack]),
        [],
    );
    const removeFromPanelStack = useCallback(() => setCurrentPanelStack(stack => stack.slice(1)), []);

    const stackList = (
        <>
            <Switch checked={activePanelOnly} label="Render active panel only" onChange={toggleActiveOnly} />
            <Switch checked={showHeader} label="Show panel header" onChange={toggleShowHeader} />
            <H5>Current stack</H5>
            <UL>
                {currentPanelStack.map((p, i) => (
                    <li key={i}>{p.title}</li>
                ))}
            </UL>
        </>
    );
    return (
        <Example options={stackList} {...props}>
            <PanelStack2
                className="docs-panel-stack-example"
                initialPanel={currentPanelStack[0]}
                onOpen={addToPanelStack}
                onClose={removeFromPanelStack}
                renderActivePanelOnly={activePanelOnly}
                showPanelHeader={showHeader}
            />
        </Example>
    );
};
