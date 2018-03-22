/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Intent, IProps } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

export interface IBannerProps extends IProps {
    /** Link URL. */
    href: string;

    /**
     * Intent color of banner.
     * @default Intent.PRIMARY
     */
    intent?: Intent;
}

/**
 * Render `Banner` before `Documentation` for a full-width colored banner link across the top of the page.
 * Use this to alert users to make changes or new pages.
 */
export class Banner extends React.PureComponent<IBannerProps> {
    public render() {
        const { children, className, href, intent = Intent.PRIMARY } = this.props;
        const classes = classNames("docs-banner", Classes.intentClass(intent), className);
        return (
            <a className={classes} href={href} target="_blank">
                {children}
            </a>
        );
    }
}
