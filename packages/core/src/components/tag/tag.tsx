/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { Classes, IIntentProps, IProps, Utils } from "../../common";
import { Icon } from "../icon/icon";

export interface ITagProps extends IProps, IIntentProps, React.HTMLAttributes<HTMLSpanElement> {
    /**
     * If set to `true`, the tag will display in an active state.
     * This is equivalent to setting `className={Classes.ACTIVE}`.
     * @default false
     */
    active?: boolean;

    /**
     * Whether the tag should visually respond to user interactions. If set
     * to `true`, hovering over the tag will change its color and mouse cursor.
     *
     * Recommended when `onClick` is also defined.
     *
     * @default false
     */
    interactive?: boolean;

    /** Whether this tag should use large styles. */
    large?: boolean;

    /** Whether this tag should use minimal styles. */
    minimal?: boolean;

    /**
     * Callback invoked when the tag is clicked.
     * Recommended when `interactive` is `true`.
     */
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;

    /**
     * Click handler for remove button.
     * Button will only be rendered if this prop is defined.
     */
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>, tagProps: ITagProps) => void;

    /** Whether this tag should have rounded ends. */
    round?: boolean;
}

export class Tag extends React.PureComponent<ITagProps, {}> {
    public static displayName = "Blueprint2.Tag";

    public render() {
        const {
            active,
            children,
            className,
            intent,
            interactive,
            large,
            minimal,
            onRemove,
            round,
            ...htmlProps
        } = this.props;
        const isRemovable = Utils.isFunction(onRemove);
        const tagClasses = classNames(
            Classes.TAG,
            Classes.intentClass(intent),
            {
                [Classes.TAG_REMOVABLE]: isRemovable,
                [Classes.ACTIVE]: active,
                [Classes.INTERACTIVE]: interactive,
                [Classes.LARGE]: large,
                [Classes.MINIMAL]: minimal,
                [Classes.ROUND]: round,
            },
            className,
        );
        const isLarge = large || tagClasses.indexOf(Classes.LARGE) >= 0;
        const removeButton = isRemovable ? (
            <button type="button" className={Classes.TAG_REMOVE} onClick={this.onRemoveClick}>
                <Icon icon="small-cross" iconSize={isLarge ? Icon.SIZE_LARGE : Icon.SIZE_STANDARD} />
            </button>
        ) : null;

        return (
            <span {...htmlProps} className={tagClasses}>
                {children}
                {removeButton}
            </span>
        );
    }

    private onRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        Utils.safeInvoke(this.props.onRemove, e, this.props);
    };
}
