// Copyright 2018 Palantir Technologies, Inc. All rights reserved.

import * as React from "react";

import { PanelHeader } from "./panelHeader";
import { IPanel, IPanelProps } from "./panelStack";

import * as Classes from "../../common/classes";

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
        return (
            <div className={Classes.PANEL_STACK_VIEW}>
                {this.renderPanelHeader()}
                <panel.component {...panelProps} {...panel.props} />
            </div>
        );
    }

    private renderPanelHeader() {
        if (this.props.previousPanel === undefined) {
            return <PanelHeader>{this.props.panel.title}</PanelHeader>;
        }
        return (
            <PanelHeader backTitle={this.props.previousPanel.title} onBackClick={this.props.panelProps.closePanel}>
                {this.props.panel.title}
            </PanelHeader>
        );
    }
}
