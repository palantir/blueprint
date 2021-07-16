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

/**
 * @fileoverview
 * Panel stacks typically have heterogenous panels, each with different information and actions,
 * so it's important to represent that kind of use case in the docs example. Here, we have 3 panel types.
 * Panel1 renders either a new Panel2 or Panel3. Panel2 and Panel3 both render a new Panel1.
 */

import React, { useCallback, useState } from "react";

import { Button, H5, Intent, Panel, PanelProps, NumericInput, PanelStack, Switch, UL } from "@blueprintjs/core";
import { Example, handleBooleanChange, ExampleProps } from "@blueprintjs/docs-theme";

const Panel1: React.FC<PanelProps> = props => {
    const [counter, setCounter] = useState(0);
    const shouldOpenPanelType2 = counter % 2 === 0;

    const openNewPanel = () => {
        if (shouldOpenPanelType2) {
            props.openPanel({
                renderPanel: panelProps => <Panel2 {...panelProps} counter={counter} />,
                title: `Panel 2`,
            });
        } else {
            props.openPanel({
                renderPanel: panelProps => (
                    <Panel3 {...panelProps} intent={counter % 3 === 0 ? Intent.SUCCESS : Intent.WARNING} />
                ),
                title: `Panel 3`,
            });
        }
    };

    return (
        <div className="docs-panel-stack-contents-example">
            <Button
                intent={Intent.PRIMARY}
                onClick={openNewPanel}
                text={`Open panel type ${shouldOpenPanelType2 ? 2 : 3}`}
            />
            <NumericInput value={counter} stepSize={1} onValueChange={setCounter} />
        </div>
    );
};

interface Panel2Props {
    counter: number;
}

const Panel2: React.FC<PanelProps & Panel2Props> = props => {
    const openNewPanel = () => {
        props.openPanel({
            renderPanel: Panel1,
            title: `Panel 1`,
        });
    };

    return (
        <div className="docs-panel-stack-contents-example">
            <H5>Parent counter was {props.counter}</H5>
            <Button intent={Intent.PRIMARY} onClick={openNewPanel} text="Open panel type 1" />
        </div>
    );
};

interface Panel3Props {
    intent: Intent;
}

const Panel3: React.FC<PanelProps & Panel3Props> = props => {
    const openNewPanel = () => {
        props.openPanel({
            renderPanel: Panel1,
            title: `Panel 1`,
        });
    };

    return (
        <div className="docs-panel-stack-contents-example">
            <Button intent={props.intent} onClick={openNewPanel} text="Open panel type 1" />
        </div>
    );
};

const initialPanel: Panel = {
    renderPanel: Panel1,
    title: "Panel 1",
};

export const PanelStackExample: React.FC<ExampleProps> = props => {
    const [activePanelOnly, setActivePanelOnly] = useState(true);
    const [showHeader, setShowHeader] = useState(true);
    const [currentPanelStack, setCurrentPanelStack] = useState<Panel[]>([initialPanel]);

    const toggleActiveOnly = useCallback(handleBooleanChange(setActivePanelOnly), []);
    const toggleShowHeader = useCallback(handleBooleanChange(setShowHeader), []);
    const addToPanelStack = useCallback((newPanel: Panel) => setCurrentPanelStack(stack => [...stack, newPanel]), []);
    const removeFromPanelStack = useCallback(() => setCurrentPanelStack(stack => stack.slice(0, -1)), []);

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
            <PanelStack
                className="docs-panel-stack-example"
                onOpen={addToPanelStack}
                onClose={removeFromPanelStack}
                renderActivePanelOnly={activePanelOnly}
                showPanelHeader={showHeader}
                stack={currentPanelStack}
            />
        </Example>
    );
};
