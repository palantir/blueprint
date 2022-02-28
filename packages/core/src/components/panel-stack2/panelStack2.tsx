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

import classNames from "classnames";
import * as React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { Classes, DISPLAYNAME_PREFIX, Props } from "../../common";
import { Panel } from "./panelTypes";
import { PanelView2 } from "./panelView2";

/**
 * @template T type union of all possible panels in this stack
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export interface PanelStack2Props<T extends Panel<object>> extends Props {
    /**
     * The initial panel to show on mount. This panel cannot be removed from the
     * stack and will appear when the stack is empty.
     * This prop is only used in uncontrolled mode and is thus mutually
     * exclusive with the `stack` prop.
     */
    initialPanel?: T;

    /**
     * Callback invoked when the user presses the back button or a panel
     * closes itself with a `closePanel()` action.
     */
    onClose?: (removedPanel: T) => void;

    /**
     * Callback invoked when a panel opens a new panel with an `openPanel(panel)`
     * action.
     */
    onOpen?: (addedPanel: T) => void;

    /**
     * If false, PanelStack will render all panels in the stack to the DOM, allowing their
     * React component trees to maintain state as a user navigates through the stack.
     * Panels other than the currently active one will be invisible.
     *
     * @default true
     */
    renderActivePanelOnly?: boolean;

    /**
     * Whether to show the header with the "back" button in each panel.
     *
     * @default true
     */
    showPanelHeader?: boolean;

    /**
     * The full stack of panels in controlled mode. The last panel in the stack
     * will be displayed.
     */
    stack?: readonly T[];
}

interface PanelStack2Component {
    /**
     * @template T type union of all possible panels in this stack
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    <T extends Panel<object>>(props: PanelStack2Props<T>): JSX.Element | null;
    displayName: string;
}

/**
 * @template T type union of all possible panels in this stack
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const PanelStack2: PanelStack2Component = <T extends Panel<object>>(props: PanelStack2Props<T>) => {
    const { renderActivePanelOnly = true, showPanelHeader = true, stack: propsStack } = props;
    const [direction, setDirection] = React.useState("push");

    const [localStack, setLocalStack] = React.useState<T[]>(
        props.initialPanel !== undefined ? [props.initialPanel] : [],
    );
    const stack = React.useMemo(() => (propsStack != null ? propsStack.slice().reverse() : localStack), [
        localStack,
        propsStack,
    ]);
    const stackLength = React.useRef<number>(stack.length);
    React.useEffect(() => {
        if (stack.length !== stackLength.current) {
            // Adjust the direction in case the stack size has changed, controlled or uncontrolled
            setDirection(stack.length - stackLength.current < 0 ? "pop" : "push");
        }
        stackLength.current = stack.length;
    }, [stack]);

    const handlePanelOpen = React.useCallback(
        (panel: T) => {
            props.onOpen?.(panel);
            if (props.stack == null) {
                setLocalStack(prevStack => [panel, ...prevStack]);
            }
        },
        [props.onOpen],
    );
    const handlePanelClose = React.useCallback(
        (panel: T) => {
            // only remove this panel if it is at the top and not the only one.
            if (stack[0] !== panel || stack.length <= 1) {
                return;
            }
            props.onClose?.(panel);
            if (props.stack == null) {
                setLocalStack(prevStack => prevStack.slice(1));
            }
        },
        [stack, props.onClose],
    );

    // early return, after all hooks are called
    if (stack.length === 0) {
        return null;
    }

    const panelsToRender = renderActivePanelOnly ? [stack[0]] : stack;
    const panels = panelsToRender
        .map((panel: T, index: number) => {
            // With renderActivePanelOnly={false} we would keep all the CSSTransitions rendered,
            // therefore they would not trigger the "enter" transition event as they were entered.
            // To force the enter event, we want to change the key, but stack.length is not enough
            // and a single panel should not rerender as long as it's hidden.
            // This key contains two parts: first one, stack.length - index is constant (and unique) for each panel,
            // second one, active changes only when the panel becomes or stops being active.
            const layer = stack.length - index;
            const key = renderActivePanelOnly ? stack.length : layer;

            return (
                <CSSTransition classNames={Classes.PANEL_STACK2} key={key} timeout={400}>
                    <PanelView2<T>
                        onClose={handlePanelClose}
                        onOpen={handlePanelOpen}
                        panel={panel}
                        previousPanel={stack[index + 1]}
                        showHeader={showPanelHeader}
                    />
                </CSSTransition>
            );
        })
        .reverse();

    const classes = classNames(Classes.PANEL_STACK2, `${Classes.PANEL_STACK2}-${direction}`, props.className);

    return (
        <TransitionGroup className={classes} component="div">
            {panels}
        </TransitionGroup>
    );
};
PanelStack2.displayName = `${DISPLAYNAME_PREFIX}.PanelStack2`;
