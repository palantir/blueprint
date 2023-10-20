/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { Error, type IconName, InfoSign, Tick, WarningSign } from "@blueprintjs/icons";

import {
    AbstractPureComponent,
    Classes,
    DISPLAYNAME_PREFIX,
    type HTMLDivProps,
    Intent,
    type IntentProps,
    type MaybeElement,
    type Props,
    Utils,
} from "../../common";
import { H5 } from "../html/html";
import { Icon } from "../icon/icon";

/** This component also supports the full range of HTML `<div>` attributes. */
export interface CalloutProps extends IntentProps, Props, HTMLDivProps {
    /** Callout contents. */
    children?: React.ReactNode;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render on the left side.
     *
     * If this prop is omitted or `undefined`, the `intent` prop will determine a default icon.
     * If this prop is explicitly `null`, no icon will be displayed (regardless of `intent`).
     */
    icon?: IconName | MaybeElement;

    /**
     * Visual intent color to apply to background, title, and icon.
     *
     * Defining this prop also applies a default icon, if the `icon` prop is omitted.
     */
    intent?: Intent;

    /**
     * String content of optional title element.
     *
     * Due to a conflict with the HTML prop types, to provide JSX content simply
     * pass `<H4>JSX title content</H4>` as first `children` element instead of
     * using this prop (note uppercase tag name to use the Blueprint Heading
     * component).
     */
    title?: string;
}

/**
 * Callout component.
 *
 * @see https://blueprintjs.com/docs/#core/components/callout
 */
export class Callout extends AbstractPureComponent<CalloutProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Callout`;

    public render() {
        const { className, children, icon, intent, title, ...htmlProps } = this.props;
        const iconElement = this.renderIcon(icon, intent);
        const classes = classNames(Classes.CALLOUT, Classes.intentClass(intent), className, {
            [Classes.CALLOUT_HAS_BODY_CONTENT]: !Utils.isReactNodeEmpty(children),
            [Classes.CALLOUT_ICON]: iconElement != null,
        });

        return (
            <div className={classes} {...htmlProps}>
                {iconElement}
                {title && <H5>{title}</H5>}
                {children}
            </div>
        );
    }

    private renderIcon(icon?: CalloutProps["icon"], intent?: Intent): IconName | MaybeElement {
        // 1. no icon
        if (icon === null || icon === false) {
            return undefined;
        }

        const iconProps = { "aria-hidden": true, tabIndex: -1 };

        // 2. icon specified by name or as a custom SVG element
        if (icon !== undefined) {
            return <Icon icon={icon} {...iconProps} />;
        }

        // 3. icon specified by intent prop
        switch (intent) {
            case Intent.DANGER:
                return <Error {...iconProps} />;
            case Intent.PRIMARY:
                return <InfoSign {...iconProps} />;
            case Intent.WARNING:
                return <WarningSign {...iconProps} />;
            case Intent.SUCCESS:
                return <Tick {...iconProps} />;
            default:
                return undefined;
        }
    }
}
