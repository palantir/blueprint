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
import { createRef, useCallback, useMemo, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { Classes, DISPLAYNAME_PREFIX, type Props } from "../../common";
import { usePrevious } from "../../hooks";

import type { Panel } from "./panelTypes";
import { PanelView } from "./panelView";

/** @deprecated Use `PanelStackProps` instead */
export type PanelStack2Props<T extends Panel<object>> = PanelStackProps<T>;

/**
 * @template T type union of all possible panels in this stack
 */
export interface PanelStackProps<T extends Panel<object>> extends Props {
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

interface PanelStackComponent {
    /**
     * @template T type union of all possible panels in this stack
     */
    <T extends Panel<object>>(props: PanelStackProps<T>): React.JSX.Element | null;
    displayName: string;
}

interface PanelNodeEntry {
    ref: React.RefObject<HTMLDivElement>;
    onExited: () => void;
}

/**
 * Panel stack component.
 *
 * @see https://blueprintjs.com/docs/#core/components/panel-stack
 * @template T type union of all possible panels in this stack
 */
export const PanelStack: PanelStackComponent = <T extends Panel<object>>(props: PanelStackProps<T>) => {
    const {
        initialPanel,
        onClose,
        onOpen,
        renderActivePanelOnly = true,
        showPanelHeader = true,
        stack: propsStack,
    } = props;
    const isControlled = propsStack != null;

    const [localStack, setLocalStack] = useState<T[]>(initialPanel !== undefined ? [initialPanel] : []);
    const stack = useMemo(
        () => (isControlled ? propsStack.slice().reverse() : localStack),
        [localStack, isControlled, propsStack],
    );
    const prevStackLength = usePrevious(stack.length) ?? stack.length;
    const direction = stack.length - prevStackLength < 0 ? "pop" : "push";

    // Map of CSSTransition key -> PanelNodeEntry for each PanelView root DOM node.
    // Each CSSTransition needs its own nodeRef to avoid ReactDOM.findDOMNode() usage.
    const panelNodes = useRef<Map<number, PanelNodeEntry>>(new Map());
    const getOrCreatePanelNode = useCallback((key: number): PanelNodeEntry => {
        let entry = panelNodes.current.get(key);
        if (entry == null) {
            entry = {
                onExited: () => panelNodes.current.delete(key),
                ref: createRef<HTMLDivElement>(),
            };
            panelNodes.current.set(key, entry);
        }
        return entry;
    }, []);

    const handlePanelOpen = useCallback(
        (panel: T) => {
            onOpen?.(panel);
            if (!isControlled) {
                setLocalStack(prevStack => [panel, ...prevStack]);
            }
        },
        [onOpen, isControlled],
    );
    const handlePanelClose = useCallback(
        (panel: T) => {
            onClose?.(panel);
            if (!isControlled) {
                setLocalStack(prevStack => prevStack.slice(1));
            }
        },
        [onClose, isControlled],
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
            const { onExited, ref: panelRef } = getOrCreatePanelNode(key);

            return (
                <CSSTransition
                    classNames={Classes.PANEL_STACK}
                    key={key}
                    nodeRef={panelRef}
                    onExited={onExited}
                    timeout={400}
                >
                    <PanelView<T>
                        onClose={handlePanelClose}
                        onOpen={handlePanelOpen}
                        panel={panel}
                        panelNodeRef={panelRef}
                        previousPanel={stack[index + 1]}
                        showHeader={showPanelHeader}
                    />
                </CSSTransition>
            );
        })
        .reverse();

    const classes = classNames(Classes.PANEL_STACK, `${Classes.PANEL_STACK}-${direction}`, props.className);

    return (
        <TransitionGroup className={classes} component="div">
            {panels}
        </TransitionGroup>
    );
};
PanelStack.displayName = `${DISPLAYNAME_PREFIX}.PanelStack`;

/** @deprecated Use `PanelStack` instead */
export const PanelStack2 = PanelStack;
export type PanelStack2 = PanelStackComponent;
