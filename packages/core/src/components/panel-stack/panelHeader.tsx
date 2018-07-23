// Copyright 2018 Palantir Technologies, Inc. All rights reserved.

import * as React from "react";

import { Text } from "../text/text";

import { Button } from "..";
import * as Classes from "../../common/classes";

export interface IPanelHeaderProps {
    /**
     * The name of the previous panel header in the stack, used as text for the
     * back button. This prop is ignored if `onBackClick` is omitted.
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
                <span>{this.maybeRenderBack()}</span>
                <Text className={Classes.HEADING} ellipsize={true}>
                    {this.props.children}
                </Text>
                <span />
            </div>
        );
    }

    private maybeRenderBack() {
        if (this.props.onBackClick === undefined) {
            return null;
        }
        return (
            <Button
                className={Classes.PANELSTACK_HEADER_BACK}
                icon="chevron-left"
                minimal={true}
                small={true}
                text={this.props.backTitle}
                onClick={this.props.onBackClick}
            />
        );
    }
}
