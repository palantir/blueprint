/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { Text } from "../text/text";
import { IPanel } from "./panelProps";

export interface IPanelViewProps {
    /**
     * Callback invoked when the user presses the back button or a panel invokes
     * the `closePanel()` injected prop method.
     */
    onClose: (removedPanel: IPanel) => void;

    /**
     * Callback invoked when a panel invokes the `openPanel(panel)` injected
     * prop method.
     */
    onOpen: (addedPanel: IPanel) => void;

    /** The panel to be displayed. */
    panel: IPanel;

    /** The previous panel in the stack, for rendering the "back" button. */
    previousPanel?: IPanel;
}

export class PanelView extends React.PureComponent<IPanelViewProps> {
    public render() {
        const { panel, onOpen } = this.props;
        // two <span> tags in header ensure title is centered as long as
        // possible, due to `flex: 1` magic.
        return (
            <div className={Classes.PANEL_STACK_VIEW}>
                <div className={Classes.PANEL_STACK_HEADER}>
                    <span>{this.maybeRenderBack()}</span>
                    <Text className={Classes.HEADING} ellipsize={true}>
                        {panel.title}
                    </Text>
                    <span />
                </div>
                <panel.component openPanel={onOpen} closePanel={this.handleClose} {...panel.props} />
            </div>
        );
    }

    private maybeRenderBack() {
        if (this.props.previousPanel === undefined) {
            return null;
        }
        return (
            <Button
                className={Classes.PANEL_STACK_HEADER_BACK}
                icon="chevron-left"
                minimal={true}
                onClick={this.handleClose}
                small={true}
                text={this.props.previousPanel.title}
            />
        );
    }

    private handleClose = () => this.props.onClose(this.props.panel);
}
