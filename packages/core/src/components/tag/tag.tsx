/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Utils } from "../../common";
import { IIntentProps, IProps, removeNonHTMLProps } from "../../common/props";

import * as Classes from "../../common/classes";

export interface ITagProps extends IProps, IIntentProps, React.HTMLAttributes<Tag> {
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

@PureRender
export class Tag extends React.Component<ITagProps, {}> {
    public static displayName = "Blueprint.Tag";

    public render() {
        const { active, className, intent, onRemove } = this.props;
        const tagClasses = classNames(Classes.TAG, Classes.intentClass(intent), {
            [Classes.TAG_REMOVABLE]: onRemove != null,
            [Classes.ACTIVE]: active,
        }, className);
        const button = Utils.isFunction(onRemove)
            ? <button type="button" className={Classes.TAG_REMOVE} onClick={this.onRemoveClick} />
            : undefined;

        return (
            <span {...removeNonHTMLProps(this.props)} className={tagClasses}>
                {this.props.children}
                {button}
            </span>
        );
    }

    private onRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        Utils.safeInvoke(this.props.onRemove, e, this.props);
    }
}

export const TagFactory = React.createFactory(Tag);
