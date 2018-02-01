/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes, IIntentProps, Intent, IProps } from "../../common";
import { Icon } from "../../index";
import { IconName } from "../icon/icon";

/** This component also supports the full range of HTML `<div>` props. */
export interface ICalloutProps extends IIntentProps, IProps {
    /**
     * Name of icon to render on left-hand side.
     * If this prop is omitted, the `intent` prop will determine a default icon.
     */
    iconName?: IconName;

    /**
     * String content of optional title element.
     *
     * Due to a conflict with the HTML prop types, to provide JSX content simply pass
     * `<h5>JSX title content<h5>` as first `children` element instead of using this prop.
     */
    title?: string;
}

export class Callout extends React.PureComponent<ICalloutProps & React.HTMLAttributes<HTMLDivElement>, {}> {
    public render() {
        const { className, children, iconName: _nospread, intent, title, ...htmlProps } = this.props;
        const iconName = this.getIconName();
        const classes = classNames(
            Classes.CALLOUT,
            Classes.intentClass(intent),
            { [Classes.CALLOUT_ICON]: iconName != null },
            className,
        );
        return (
            <div className={classes} {...htmlProps}>
                {iconName && <Icon className={Classes.CALLOUT_ICON} iconName={iconName} iconSize={Icon.SIZE_LARGE} />}
                {title && <h5>{title}</h5>}
                {children}
            </div>
        );
    }

    private getIconName(): IconName {
        const { iconName, intent } = this.props;
        if (iconName != null || intent === Intent.NONE) {
            return iconName;
        }
        switch (intent) {
            case Intent.DANGER:
                return "error";
            case Intent.PRIMARY:
                return "info-sign";
            case Intent.WARNING:
                return "warning-sign";
            case Intent.SUCCESS:
                return "tick";
        }
    }
}
