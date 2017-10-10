/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Classes, IIntentProps, IProps } from "../../common";
import { IconName } from "../icon/icon";

/** This component also supports the full range of HTML `<div>` props. */
export interface ICalloutProps extends IIntentProps, IProps {
    /** Name of icon to render on left-hand side. */
    iconName?: IconName;

    /**
     * String content of optional title element.
     *
     * Due to a conflict with the HTML prop types, to provide JSX content simply pass
     * `<h5>JSX title content<h5>` as first `children` element instead of using this prop.
     */
    title?: string;
}

@PureRender
export class Callout extends React.Component<ICalloutProps & React.HTMLAttributes<HTMLDivElement>, {}> {
    public render() {
        const { className, children, iconName, intent, title, ...htmlProps } = this.props;
        const classes = classNames(
            Classes.CALLOUT,
            Classes.intentClass(intent),
            Classes.iconClass(iconName),
            className,
        );
        return (
            <div className={classes} {...htmlProps}>
                {title && <h5>{title}</h5>}
                {children}
            </div>
        );
    }
}
