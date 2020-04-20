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

import { polyfill } from "react-lifecycles-compat";
import { AbstractPureComponent2 } from "../../common";
import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX, IProps, MaybeElement } from "../../common/props";
import { ensureElement } from "../../common/utils";
import { H4 } from "../html/html";
import { Icon, IconName } from "../icon/icon";

export interface INonIdealStateProps extends IProps {
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

    /** The title of the non-ideal state. */
    title?: React.ReactNode;
}

@polyfill
export class NonIdealState extends AbstractPureComponent2<INonIdealStateProps, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.NonIdealState`;

    public render() {
        const { action, children, className, description, title } = this.props;
        return (
            <div className={classNames(Classes.NON_IDEAL_STATE, className)}>
                {this.maybeRenderVisual()}
                {title && <H4>{title}</H4>}
                {description && ensureElement(description, "div")}
                {action}
                {children}
            </div>
        );
    }

    private maybeRenderVisual() {
        const { icon } = this.props;
        if (icon == null) {
            return null;
        } else {
            return (
                <div className={Classes.NON_IDEAL_STATE_VISUAL}>
                    <Icon icon={icon} iconSize={Icon.SIZE_LARGE * 3} />
                </div>
            );
        }
    }
}
