// Copyright 2018 Palantir Technologies, Inc. All rights reserved.

import classNames from "classnames";
import * as React from "react";

import { IBackButton, PanelHeader } from "./panelHeader";
import { IPanel, IPanelProps } from "./panelStack";

import * as Classes from "../../common/classes";

export interface IPanelViewProps {
    className?: string;
    panel: IPanel;
    panelProps: IPanelProps;
    previousPanel?: IPanel;
}

export class PanelView extends React.PureComponent<IPanelViewProps> {
    public render() {
        const { panel, panelProps, previousPanel } = this.props;
        const back: IBackButton | undefined =
            previousPanel !== undefined
                ? {
                      onClick: panelProps.closePanel,
                      title: previousPanel.title,
                  }
                : undefined;
        const className = classNames(Classes.PANELSTACK_VIEW, this.props.className);
        return (
            <div className={className}>
                <PanelHeader back={back} title={panel.title} />
                <panel.component {...panelProps} {...panel.props} />
            </div>
        );
    }
}
