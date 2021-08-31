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

import React, { useCallback } from "react";

import { ChevronLeft } from "@blueprintjs/icons";

import { Classes, DISPLAYNAME_PREFIX } from "../../common";
import { Button } from "../button/buttons";
import { Text } from "../text/text";
import { Panel } from "./panelTypes";

export interface PanelViewProps {
    /**
     * Callback invoked when the user presses the back button or a panel invokes
     * the `closePanel()` injected prop method.
     */
    onClose: (removedPanel: Panel) => void;

    /**
     * Callback invoked when a panel invokes the `openPanel(panel)` injected
     * prop method.
     */
    onOpen: (addedPanel: Panel) => void;

    /** The panel to be displayed. */
    panel: Panel;

    /** The previous panel in the stack, for rendering the "back" button. */
    previousPanel?: Panel;

    /** Whether to show the header with the "back" button. */
    showHeader: boolean;
}

interface PanelViewComponent {
    (props: PanelViewProps): JSX.Element | null;
    displayName: string;
}

export const PanelView: PanelViewComponent = (props: PanelViewProps) => {
    const handleClose = useCallback(() => props.onClose(props.panel), [props.onClose, props.panel]);

    const maybeBackButton =
        props.previousPanel === undefined ? null : (
            <Button
                aria-label="Back"
                className={Classes.PANEL_STACK_HEADER_BACK}
                icon={<ChevronLeft />}
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
    const PanelWrapper: React.FunctionComponent = React.useMemo(
        () => () =>
            props.panel.renderPanel({
                closePanel: handleClose,
                openPanel: props.onOpen,
            }),
        [props.panel.renderPanel, handleClose, props.onOpen],
    );

    return (
        <div className={Classes.PANEL_STACK_VIEW}>
            {props.showHeader && (
                <div className={Classes.PANEL_STACK_HEADER}>
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
PanelView.displayName = `${DISPLAYNAME_PREFIX}.PanelView`;
