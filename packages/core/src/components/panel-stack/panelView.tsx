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

/**
 * @fileoverview This component is DEPRECATED, and the code is frozen.
 * All changes & bugfixes should be made to PanelStack2 instead.
 */

/* eslint-disable deprecation/deprecation */

import * as React from "react";

import { AbstractPureComponent, Classes } from "../../common";
import { Button } from "../button/buttons";
import { Text } from "../text/text";
import type { IPanel } from "./panelProps";

export interface IPanelViewProps {
    /**
     * Callback invoked when the user presses the back button or a panel invokes
     * the `closePanel()` injected prop method.
     */
    onClose: (removedPanel: IPanel<any>) => void;

    /**
     * Callback invoked when a panel invokes the `openPanel(panel)` injected
     * prop method.
     */
    onOpen: (addedPanel: IPanel<any>) => void;

    /** The panel to be displayed. */
    panel: IPanel;

    /** The previous panel in the stack, for rendering the "back" button. */
    previousPanel?: IPanel;

    /** Whether to show the header with the "back" button. */
    showHeader: boolean;
}

export class PanelView extends AbstractPureComponent<IPanelViewProps> {
    public render() {
        const { panel, onOpen } = this.props;
        // two <span> tags in header ensure title is centered as long as
        // possible, due to `flex: 1` magic.
        return (
            <div className={Classes.PANEL_STACK_VIEW}>
                {this.maybeRenderHeader()}
                <panel.component openPanel={onOpen} closePanel={this.handleClose} {...panel.props} />
            </div>
        );
    }

    private maybeRenderHeader() {
        if (!this.props.showHeader) {
            return null;
        }
        return (
            <div className={Classes.PANEL_STACK_HEADER}>
                <span>{this.maybeRenderBack()}</span>
                <Text className={Classes.HEADING} ellipsize={true} title={this.props.panel.htmlTitle}>
                    {this.props.panel.title}
                </Text>
                <span />
            </div>
        );
    }

    private maybeRenderBack() {
        if (this.props.previousPanel === undefined) {
            return null;
        }
        return (
            <Button
                aria-label="Back"
                className={Classes.PANEL_STACK_HEADER_BACK}
                icon="chevron-left"
                minimal={true}
                onClick={this.handleClose}
                small={true}
                text={this.props.previousPanel.title}
                title={this.props.previousPanel.htmlTitle}
            />
        );
    }

    private handleClose = () => this.props.onClose(this.props.panel);
}
