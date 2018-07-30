/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { Text } from "../text/text";
import { IPanel, IPanelProps } from "./panelProps";

export interface IPanelViewProps {
    /** The panel to be displayed. */
    panel: IPanel;

    /** Props to inject into the panel, in addition to its own props. */
    panelProps: IPanelProps;

    /** The previous panel in the stack, for rendering the "back" button. */
    previousPanel?: IPanel;
}

export class PanelView extends React.PureComponent<IPanelViewProps> {
    public render() {
        const { panel, panelProps } = this.props;
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
                <panel.component {...panelProps} {...panel.props} />
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
                onClick={this.props.panelProps.closePanel}
                small={true}
                text={this.props.previousPanel.title}
            />
        );
    }
}
