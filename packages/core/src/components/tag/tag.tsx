/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { IIntentProps, IProps, removeNonHTMLProps } from "../../common/props";
import { isFunction } from "../../common/utils";

import * as Classes from "../../common/classes";

export interface ITagProps extends IProps, IIntentProps, React.HTMLProps<HTMLSpanElement> {
    /**
     * Click handler for remove button.
     * Button will only be rendered if this prop is defined.
     */
    onRemove?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

export class Tag extends React.PureComponent<ITagProps, {}> {
    public displayName = "Blueprint.Tag";

    public render() {
        const { className, intent, onRemove } = this.props;
        const tagClasses = classNames(Classes.TAG, Classes.intentClass(intent), {
            [Classes.TAG_REMOVABLE]: onRemove != null,
        }, className);

        return (
            <span {...removeNonHTMLProps(this.props)} className={tagClasses}>
                {this.props.children}
                {isFunction(onRemove) ? <button className={Classes.TAG_REMOVE} onClick={onRemove} /> : null}
            </span>
        );
    }
}

export const TagFactory = React.createFactory(Tag);
