/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent2 } from "../../common";
import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX, MaybeElement, Props } from "../../common/props";
import { ensureElement } from "../../common/utils";
import { H4 } from "../html/html";
import { Icon, IconName, IconSize } from "../icon/icon";

export enum NonIdealStateIconSize {
    STANDARD = IconSize.STANDARD * 3,
    SMALL = IconSize.STANDARD * 2,
    EXTRA_SMALL = IconSize.LARGE,
}

// eslint-disable-next-line deprecation/deprecation
export type NonIdealStateProps = INonIdealStateProps;
/** @deprecated use NonIdealStateProps */
export interface INonIdealStateProps extends Props {
    /** An action to resolve the non-ideal state which appears after `description`. */
    action?: JSX.Element;

    /**
     * Advanced usage: React `children` will appear last (after `action`).
     * Avoid passing raw strings as they will not receive margins and disrupt the layout flow.
     */
    children?: React.ReactNode;

    /**
     * A longer description of the non-ideal state.
     * A string or number value will be wrapped in a `<div>` to preserve margins.
     */
    description?: React.ReactChild;

    /** The name of a Blueprint icon or a JSX Element (such as `<Spinner/>`) to render above the title. */
    icon?: IconName | MaybeElement;

    /**
     * How large the icon visual should be.
     *
     * @default NonIdealStateIconSize.STANDARD
     */
    iconSize?: NonIdealStateIconSize;

    /**
     * Component layout, either vertical or horizontal.
     *
     * @default "vertical"
     */
    layout?: "vertical" | "horizontal";

    /** The title of the non-ideal state. */
    title?: React.ReactNode;
}

export class NonIdealState extends AbstractPureComponent2<NonIdealStateProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.NonIdealState`;

    public static defaultProps: Partial<NonIdealStateProps> = {
        iconSize: NonIdealStateIconSize.STANDARD,
        layout: "vertical",
    };

    public render() {
        const { action, children, className, layout } = this.props;

        return (
            <div className={classNames(Classes.NON_IDEAL_STATE, `${Classes.NON_IDEAL_STATE}-${layout}`, className)}>
                {this.maybeRenderVisual()}
                {this.maybeRenderText()}
                {action}
                {children}
            </div>
        );
    }

    private maybeRenderVisual() {
        const { icon, iconSize } = this.props;
        if (icon == null) {
            return undefined;
        } else {
            return (
                <div
                    className={Classes.NON_IDEAL_STATE_VISUAL}
                    style={{ fontSize: `${iconSize}px`, lineHeight: `${iconSize}px` }}
                >
                    <Icon icon={icon} size={iconSize} aria-hidden={true} tabIndex={-1} />
                </div>
            );
        }
    }

    private maybeRenderText() {
        const { description, title } = this.props;
        if (title == null && description == null) {
            return undefined;
        } else {
            return (
                <div className={Classes.NON_IDEAL_STATE_TEXT}>
                    {title && <H4>{title}</H4>}
                    {description && ensureElement(description, "div")}
                </div>
            );
        }
    }
}
