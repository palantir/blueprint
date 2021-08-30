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

import { Classes, DISPLAYNAME_PREFIX } from "../../common";
import { Button } from "../button/buttons";
import { Text } from "../text/text";
import { Panel, PanelProps } from "./panelTypes";

// eslint-disable-next-line @typescript-eslint/ban-types
export interface PanelView2Props<T extends Panel<object>> {
    /**
     * Callback invoked when the user presses the back button or a panel invokes
     * the `closePanel()` injected prop method.
     */
    onClose: (removedPanel: T) => void;

    /**
     * Callback invoked when a panel invokes the `openPanel(panel)` injected
     * prop method.
     */
    onOpen: (addedPanel: T) => void;

    /** The panel to be displayed. */
    panel: T;

    /** The previous panel in the stack, for rendering the "back" button. */
    previousPanel?: T;

    /** Whether to show the header with the "back" button. */
    showHeader: boolean;
}

interface PanelView2Component {
    // eslint-disable-next-line @typescript-eslint/ban-types
    <T extends Panel<object>>(props: PanelView2Props<T>): JSX.Element | null;
    displayName: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const PanelView2: PanelView2Component = <T extends Panel<object>>(props: PanelView2Props<T>) => {
    const handleClose = React.useCallback(() => props.onClose(props.panel), [props.onClose, props.panel]);

    const maybeBackButton =
        props.previousPanel === undefined ? null : (
            <Button
                aria-label="Back"
                className={Classes.PANEL_STACK_HEADER_BACK}
                icon="chevron-left"
                minimal={true}
                onClick={handleClose}
                small={true}
                text={props.previousPanel.title}
                title={props.previousPanel.htmlTitle}
            />
        );

    // `props.panel.renderPanel` is simply a function that returns a JSX.Element. It may be an FC which
    // uses hooks. In order to avoid React errors due to inconsistent hook calls, we must encapsulate
    // those hooks with their own lifecycle through a very simple wrapper component.

    // N.B. A type cast is required because of error TS2345, where technically `panel.props` could be
    // instantiated with a type unrelated to our generic constraint `T` here. We know
    // we're sending the right values here though, and it makes the consumer API for this
    // component type safe, so it's ok to do this...
    const PanelWrapper: React.FunctionComponent = React.useMemo(
        () => () =>
            props.panel.renderPanel({
                closePanel: handleClose,
                openPanel: props.onOpen,
                ...props.panel.props,
            } as PanelProps<T>),
        [props.panel.renderPanel, handleClose, props.onOpen, props.panel.props],
    );

    return (
        <div className={Classes.PANEL_STACK2_VIEW}>
            {props.showHeader && (
                <div className={Classes.PANEL_STACK2_HEADER}>
                    {/* two <span> tags here ensure title is centered as long as possible, with `flex: 1` styling */}
                    <span>{maybeBackButton}</span>
                    <Text className={Classes.HEADING} ellipsize={true} title={props.panel.htmlTitle}>
                        {props.panel.title}
                    </Text>
                    <span />
                </div>
            )}
            <PanelWrapper />
        </div>
    );
};
PanelView2.displayName = `${DISPLAYNAME_PREFIX}.PanelView2`;
