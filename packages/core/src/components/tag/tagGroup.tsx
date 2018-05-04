/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { ITagProps, Tag } from "..";
import { Classes } from "../../common";
import * as Errors from "../../common/errors";
import { isElementOfType } from "../../common/utils";

export interface ITagGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Whether the child tags should appear with large styling.
     * @default false
     */
    large?: boolean;

    /** Whether this tag group should have rounded ends. */
    round?: boolean;
}

export class TagGroup extends React.PureComponent<ITagGroupProps, {}> {
    public static displayName = "Blueprint2.TagGroup";

    public render() {
        const { className, large, round, ...htmlProps } = this.props;
        const tagGroupClasses = classNames(Classes.TAG_GROUP, { [Classes.LARGE]: large }, className);

        return (
            <div className={tagGroupClasses} {...htmlProps}>
                {this.renderChildren()}
            </div>
        );
    }

    private renderChildren() {
        const { children, round } = this.props;

        return React.Children.map(children, child => {
            if (!isElementOfType(child, Tag)) {
                throw new Error(Errors.TAG_GROUP_INVALID_CHILD);
            }

            return React.cloneElement<ITagProps, ITagProps>(child, {
                ...child.props,
                className: classNames({ [Classes.ROUND]: round }, child.props.className),
            });
        });
    }
}
