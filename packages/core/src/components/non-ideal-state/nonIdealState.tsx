/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";
import { Icon, IconName } from "../icon/icon";

export interface INonIdealStateProps extends IProps {
    /**
     * An action that's attached to the non-ideal state.
     */
    action?: JSX.Element;

    /**
     * A longer description of the non-ideal state.
     */
    description?: string | JSX.Element;

    /**
     * The title of the non-ideal state.
     */
    title?: string;

    /**
     * The name of a Blueprint icon to display or a JSX Element (such as `<Spinner/>`).
     */
    visual?: IconName | JSX.Element;
}

@PureRender
export class NonIdealState extends React.Component<INonIdealStateProps, {}> {
    public render() {
        return (
            <div className={classNames(Classes.NON_IDEAL_STATE, this.props.className)}>
                {this.maybeRenderVisual()}
                {this.maybeRenderTitle()}
                {this.maybeRenderDescription()}
                {this.maybeRenderAction()}
            </div>
        );
    }

    private maybeRenderAction() {
        if (this.props.action == null) {
            return undefined;
        }

        return <div className={Classes.NON_IDEAL_STATE_ACTION}>{this.props.action}</div>;
    }

    private maybeRenderDescription() {
        if (this.props.description == null) {
            return undefined;
        }

        return <div className={Classes.NON_IDEAL_STATE_DESCRIPTION}>{this.props.description}</div>;
    }

    private maybeRenderTitle() {
        if (this.props.title == null) {
            return undefined;
        }

        return <h4 className={Classes.NON_IDEAL_STATE_TITLE}>{this.props.title}</h4>;
    }

    private maybeRenderVisual() {
        const { visual } = this.props;
        if (visual == null) {
            return undefined;
        } else if (typeof visual === "string") {
            return (
                <div className={classNames(Classes.NON_IDEAL_STATE_VISUAL, Classes.NON_IDEAL_STATE_ICON)}>
                    <Icon iconName={visual} iconSize="inherit" />
                </div>
            );
        } else {
            return <div className={Classes.NON_IDEAL_STATE_VISUAL}>{visual}</div>;
        }
    }
}

export const NonIdealStateFactory = React.createFactory(NonIdealState);
