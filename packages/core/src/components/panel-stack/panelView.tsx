// Copyright 2018 Palantir Technologies, Inc. All rights reserved.

import * as React from "react";

import { IPanel, IPanelProps } from "./panelStack";

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { Text } from "../text/text";

export interface IPanelViewProps {
    /**
     * The panel to be displayed.
     */
    panel: IPanel;

    /**
     * Props to be passed to the panel.
     */
    panelProps: IPanelProps;

    /**
     * The panel immediately under the current panel in the stack.
     */
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
                        {this.props.panel.title}
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
                small={true}
                text={this.props.previousPanel.title}
                onClick={this.props.panelProps.closePanel}
            />
        );
    }
}
