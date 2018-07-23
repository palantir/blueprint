// Copyright 2018 Palantir Technologies, Inc. All rights reserved.

import * as React from "react";

import { Icon } from "../icon/icon";
import { Text } from "../text/text";

import * as Classes from "../../common/classes";

export interface IPanelHeaderProps {
    /**
     * The name of the previous panel header in the stack. Will not render unless an onBackClick
     * handler is defined.
     */
    backTitle?: string;
    /**
     * The handler when the back button is clicked.
     */
    onBackClick?(): void;
}

export class PanelHeader extends React.PureComponent<IPanelHeaderProps> {
    public render() {
        return (
            <div className={Classes.PANELSTACK_HEADER}>
                <div className={Classes.PANELSTACK_HEADER_SPACER}>{this.maybeRenderBack()}</div>
                <Text className={Classes.PANELSTACK_HEADER_TITLE} ellipsize={true}>
                    {this.props.children}
                </Text>
                <div className={Classes.PANELSTACK_HEADER_SPACER} />
            </div>
        );
    }

    private maybeRenderBack() {
        if (this.props.onBackClick === undefined) {
            return null;
        }
        return (
            <div className={Classes.PANELSTACK_HEADER_BACK} onClick={this.props.onBackClick}>
                <Icon icon="chevron-left" />
                {this.maybeRenderBackTitle()}
            </div>
        );
    }

    private maybeRenderBackTitle() {
        if (this.props.backTitle === undefined) {
            return null;
        }
        return this.props.backTitle;
    }
}
