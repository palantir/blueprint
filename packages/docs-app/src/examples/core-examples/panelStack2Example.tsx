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

import * as React from "react";

import { Button, H5, Intent, NumericInput, Panel, PanelProps, PanelStack2, Switch, UL } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Panel1Info {
    // empty
}

const Panel1: React.FC<PanelProps<Panel1Info>> = props => {
    const [counter, setCounter] = React.useState(0);
    const shouldOpenPanelType2 = counter % 2 === 0;

    const openNewPanel = () => {
        if (shouldOpenPanelType2) {
            props.openPanel({
                props: { counter },
                renderPanel: Panel2,
                title: `Panel 2`,
            });
        } else {
            props.openPanel({
                props: { intent: counter % 3 === 0 ? Intent.SUCCESS : Intent.WARNING },
                renderPanel: Panel3,
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

interface Panel2Info {
    counter: number;
}

const Panel2: React.FC<PanelProps<Panel2Info>> = props => {
    const openNewPanel = () => {
        props.openPanel({
            props: {},
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

interface Panel3Info {
    intent: Intent;
}

const Panel3: React.FC<PanelProps<Panel3Info>> = props => {
    const openNewPanel = () => {
        props.openPanel({
            props: {},
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

const initialPanel: Panel<Panel1Info> = {
    props: {
        panelNumber: 1,
    },
    renderPanel: Panel1,
    title: "Panel 1",
};

export const PanelStack2Example: React.FC<IExampleProps> = props => {
    const [activePanelOnly, setActivePanelOnly] = React.useState(false);
    const [showHeader, setShowHeader] = React.useState(true);
    const [currentPanelStack, setCurrentPanelStack] = React.useState<
        Array<Panel<Panel1Info | Panel2Info | Panel3Info>>
    >([initialPanel]);

    const toggleActiveOnly = React.useCallback(handleBooleanChange(setActivePanelOnly), []);
    const toggleShowHeader = React.useCallback(handleBooleanChange(setShowHeader), []);
    const addToPanelStack = React.useCallback(
        (newPanel: Panel<Panel1Info | Panel2Info | Panel3Info>) => setCurrentPanelStack(stack => [...stack, newPanel]),
        [],
    );
    const removeFromPanelStack = React.useCallback(() => setCurrentPanelStack(stack => stack.slice(0, -1)), []);

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
                onOpen={addToPanelStack}
                onClose={removeFromPanelStack}
                renderActivePanelOnly={activePanelOnly}
                showPanelHeader={showHeader}
                stack={currentPanelStack}
            />
        </Example>
    );
};
