// Copyright 2018 Palantir Technologies, Inc. All rights reserved.

import * as React from "react";

import { Icon } from "../icon/icon";
import { Text } from "../text/text";

import * as Classes from "../../common/classes";

export interface IBackButton {
    title: string;
    onClick(): void;
}

export interface IPanelHeaderProps {
    back?: IBackButton;
    title: string;
}

export class PanelHeader extends React.PureComponent<IPanelHeaderProps> {
    public render() {
        return (
            <div className={Classes.PANELSTACK_HEADER}>
                <div className={Classes.PANELSTACK_HEADER_SPACER}>{this.maybeRenderBack()}</div>
                <Text className={Classes.PANELSTACK_HEADER_TITLE} ellipsize={true}>
                    {this.props.title}
                </Text>
                <div className={Classes.PANELSTACK_HEADER_SPACER} />
            </div>
        );
    }

    private maybeRenderBack() {
        if (this.props.back === undefined) {
            return null;
        }
        return (
            <div className={Classes.PANELSTACK_HEADER_BACK} onClick={this.props.back.onClick}>
                <Icon icon="chevron-left" />
                {this.props.back.title}
            </div>
        );
    }
}
