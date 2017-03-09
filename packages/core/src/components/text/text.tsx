/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export interface ITextProps extends IProps {
    /**
     * Indicates that when the children of this component overflow the container this component is in,
     * the text should be truncated and ellipsis should be added. A title attribute will also be added.
     * Defaults to false.
     */
    ellipsize?: boolean;
}

export interface ITextState {
    textContent: string;
    isEllipsized: boolean;
}

@PureRender
export class Text extends React.Component<ITextProps, ITextState> {
    public state: ITextState = {
        isEllipsized: false,
        textContent: "",
    };

    private textRef: HTMLDivElement;
    private refHandlers = {
        text: (overflowElement: HTMLDivElement) => this.textRef = overflowElement,
    };

    public componentDidMount() {
        this.update();
    }

    public componentDidUpdate() {
        this.update();
    }

    public render() {
        const classNamesMap: { [key: string]: boolean } = {};
        classNamesMap[Classes.TEXT_OVERFLOW_ELLIPSIS] = this.props.ellipsize;
        return (
            <div
                className={classNames(classNamesMap, this.props.className)}
                ref={this.refHandlers.text}
                title={this.state.isEllipsized ? this.state.textContent : undefined}
            >
                {this.props.children}
            </div>
        );
    }

    private update() {
       this.setState({
            isEllipsized: this.props.ellipsize && this.textRef.scrollWidth > this.textRef.offsetWidth,
            textContent: this.textRef.textContent,
        });
    }
}
