/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";
import { Icon, IconName } from "../icon/icon";

export interface INonIdealStateProps extends IProps {
    /** An action to resolve the non-ideal state which appears last (after `description`). */
    action?: JSX.Element;

    /** React children will appear immediately after `description` in the same container. */
    children?: React.ReactNode;

    /** A longer description of the non-ideal state. */
    description?: React.ReactNode;

    /** The title of the non-ideal state. */
    title?: React.ReactNode;

    /** The name of a Blueprint icon or a JSX Element (such as `<Spinner/>`) to render above the title. */
    visual?: IconName | JSX.Element;
}

export class NonIdealState extends React.PureComponent<INonIdealStateProps, {}> {
    public render() {
        const { action, className, title } = this.props;
        return (
            <div className={classNames(Classes.NON_IDEAL_STATE, className)}>
                {this.maybeRenderVisual()}
                {title && <h4 className={Classes.NON_IDEAL_STATE_TITLE}>{title}</h4>}
                {this.maybeRenderDescription()}
                {action && <div className={Classes.NON_IDEAL_STATE_ACTION}>{action}</div>}
            </div>
        );
    }

    private maybeRenderDescription() {
        const { children, description } = this.props;
        if (children == null && description == null) {
            return null;
        }
        return (
            <div className={Classes.NON_IDEAL_STATE_DESCRIPTION}>
                {description}
                {children}
            </div>
        );
    }

    private maybeRenderVisual() {
        const { visual } = this.props;
        if (visual == null) {
            return null;
        } else if (typeof visual === "string") {
            return (
                <div className={classNames(Classes.NON_IDEAL_STATE_VISUAL, Classes.NON_IDEAL_STATE_ICON)}>
                    <Icon icon={visual} iconSize={Icon.SIZE_LARGE * 3} />
                </div>
            );
        } else {
            return <div className={Classes.NON_IDEAL_STATE_VISUAL}>{visual}</div>;
        }
    }
}
