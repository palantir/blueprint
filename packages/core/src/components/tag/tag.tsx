/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { Utils } from "../../common";
import { IIntentProps, IProps, removeNonHTMLProps } from "../../common/props";

import * as Classes from "../../common/classes";

export interface ITagProps extends IProps, IIntentProps, React.HTMLAttributes<HTMLSpanElement> {
    /**
     * If set to `true`, the tag will display in an active state.
     * This is equivalent to setting `className="pt-active"`.
     * @default false
     */
    active?: boolean;

    /**
     * Click handler for remove button.
     * Button will only be rendered if this prop is defined.
     */
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>, tagProps: ITagProps) => void;
}

export class Tag extends React.PureComponent<ITagProps, {}> {
    public static displayName = "Blueprint2.Tag";

    public render() {
        const { active, className, intent, onRemove } = this.props;
        const tagClasses = classNames(
            Classes.TAG,
            Classes.intentClass(intent),
            {
                [Classes.TAG_REMOVABLE]: onRemove != null,
                [Classes.ACTIVE]: active,
            },
            className,
        );
        const button = Utils.isFunction(onRemove) ? (
            <button type="button" className={Classes.TAG_REMOVE} onClick={this.onRemoveClick} />
        ) : (
            undefined
        );

        return (
            <span {...removeNonHTMLProps(this.props)} className={tagClasses}>
                {this.props.children}
                {button}
            </span>
        );
    }

    private onRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        Utils.safeInvoke(this.props.onRemove, e, this.props);
    };
}
