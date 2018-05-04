/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { Classes } from "../../common";

export interface ITagGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Whether the child tags should appear with large styling.
     * @default false
     */
    large?: boolean;
}

export class TagGroup extends React.PureComponent<ITagGroupProps, {}> {
    public static displayName = "Blueprint2.TagGroup";

    public render() {
        const { children, className, large, ...htmlProps } = this.props;
        const tagGroupClasses = classNames(Classes.TAG_GROUP, { [Classes.LARGE]: large }, className);

        return (
            <div className={tagGroupClasses} {...htmlProps}>
                {children}
            </div>
        );
    }
}
