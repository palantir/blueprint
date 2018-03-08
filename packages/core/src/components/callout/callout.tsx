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
     * Name of a Blueprint UI icon (or an icon element) to render on the left side.
     *
     * If this prop is omitted or `undefined`, the `intent` prop will determine a default icon.
     * If this prop is explicitly `null`, no icon will be displayed (regardless of `intent`).
     */
    icon?: IconName | JSX.Element | null;

    /**
     * String content of optional title element.
     *
     * Due to a conflict with the HTML prop types, to provide JSX content simply pass
     * `<h4 className="pt-callout-title">JSX title content<h4>` as first `children` element instead of using this prop.
     */
    title?: string;
}

export class Callout extends React.PureComponent<ICalloutProps & React.HTMLAttributes<HTMLDivElement>, {}> {
    public render() {
        const { className, children, icon: _nospread, intent, title, ...htmlProps } = this.props;
        const iconName = this.getIconName();
        const classes = classNames(Classes.CALLOUT, Classes.intentClass(intent), className);

        const maybeIcon =
            iconName === undefined ? (
                undefined
            ) : (
                <span className={Classes.CALLOUT_ICON}>
                    <Icon icon={iconName} iconSize={Icon.SIZE_LARGE} />
                </span>
            );
        const maybeTitle = title === undefined ? undefined : <h4 className={Classes.CALLOUT_TITLE}>{title}</h4>;

        return (
            <div className={classes} {...htmlProps}>
                {maybeIcon}
                {maybeTitle}
                {children}
            </div>
        );
    }

    private getIconName(): JSX.Element | IconName | undefined {
        const { icon, intent } = this.props;
        // 1. no icon
        if (icon === null) {
            return undefined;
        }
        // 2. defined iconName prop
        if (icon !== undefined) {
            return icon;
        }
        // 3. default intent icon
        switch (intent) {
            case Intent.DANGER:
                return "error";
            case Intent.PRIMARY:
                return "info-sign";
            case Intent.WARNING:
                return "warning-sign";
            case Intent.SUCCESS:
                return "tick";
            default:
                return undefined;
        }
    }
}
