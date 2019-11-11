/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import * as React from "react";
import { polyfill } from "react-lifecycles-compat";
import { AbstractPureComponent2, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, IProps } from "../../common/props";

export interface ICollapseProps extends IProps {
    /**
     * Component to render as the root element.
     * Useful when rendering a `Collapse` inside a `<table>`, for instance.
     * @default "div"
     */
    component?: React.ReactType;

    /**
     * Whether the component is open or closed.
     * @default false
     */
    isOpen?: boolean;

    /**
     * Whether the child components will remain mounted when the `Collapse` is closed.
     * Setting to true may improve performance by avoiding re-mounting children.
     * @default false
     */
    keepChildrenMounted?: boolean;

    /**
     * The length of time the transition takes, in milliseconds. This must match
     * the duration of the animation in CSS. Only set this prop if you override
     * Blueprint's default transitions with new transitions of a different
     * length.
     * @default 200
     */
    transitionDuration?: number;
}

export interface ICollapseState {
    /** The height that should be used for the content animations. This is a CSS value, not just a number. */
    height: string;

    /** The state the element is currently in. */
    animationState: AnimationStates;
}

/**
 * `Collapse` can be in one of six states, enumerated here.
 * When changing the `isOpen` prop, the following happens to the states:
 * isOpen={true}  : CLOSED -> OPEN_START -> OPENING -> OPEN
 * isOpen={false} : OPEN -> CLOSING_START -> CLOSING -> CLOSED
 */
export enum AnimationStates {
    /**
     * The body is re-rendered, height is set to the measured body height and
     * the body Y is set to 0.
     */
    OPEN_START,

    /**
     * Animation begins, height is set to auto. This is all animated, and on
     * complete, the state changes to OPEN.
     */
    OPENING,

    /**
     * The collapse height is set to auto, and the body Y is set to 0 (so the
     * element can be seen as normal).
     */
    OPEN,

    /**
     * Height has been changed from auto to the measured height of the body to
     * prepare for the closing animation in CLOSING.
     */
    CLOSING_START,

    /**
     * Height is set to 0 and the body Y is at -height. Both of these properties
     * are transformed, and then after the animation is complete, the state
     * changes to CLOSED.
     */
    CLOSING,

    /**
     * The contents of the collapse is not rendered, the collapse height is 0,
     * and the body Y is at -height (so that the bottom of the body is at Y=0).
     */
    CLOSED,
}

@polyfill
export class Collapse extends AbstractPureComponent2<ICollapseProps, ICollapseState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Collapse`;

    public static defaultProps: ICollapseProps = {
        component: "div",
        isOpen: false,
        keepChildrenMounted: false,
        transitionDuration: 200,
    };

    public static getDerivedStateFromProps(props: ICollapseProps, state: ICollapseState) {
        const { isOpen } = props;
        const { animationState } = state;

        if (isOpen) {
            switch (animationState) {
                case AnimationStates.OPENING:
                    // allow Collapse#onDelayedStateChange() to handle the transition here
                    break;
                case AnimationStates.OPEN:
                    break;
                default:
                    return { animationState: AnimationStates.OPEN_START };
            }
        } else {
            switch (animationState) {
                case AnimationStates.CLOSING:
                    // allow Collapse#onDelayedStateChange() to handle the transition here
                    break;
                case AnimationStates.CLOSED:
                    break;
                default:
                    return { animationState: AnimationStates.CLOSING_START };
            }
        }

        return null;
    }

    public state = {
        animationState: this.props.isOpen ? AnimationStates.OPEN : AnimationStates.CLOSED,
        height: "0px",
    };

    // The element containing the contents of the collapse.
    private contents: HTMLElement;

    public render() {
        const isContentVisible = this.state.animationState !== AnimationStates.CLOSED;
        const shouldRenderChildren = isContentVisible || this.props.keepChildrenMounted;
        const displayWithTransform = isContentVisible && this.state.animationState !== AnimationStates.CLOSING;
        const isAutoHeight = this.state.height === "auto";

        const containerStyle = {
            height: isContentVisible ? this.state.height : undefined,
            overflowY: (isAutoHeight ? "visible" : undefined) as "visible" | undefined,
            transition: isAutoHeight ? "none" : undefined,
        };

        const contentsStyle = {
            transform: displayWithTransform ? "translateY(0)" : `translateY(-${this.state.height}px)`,
            transition: isAutoHeight ? "none" : undefined,
        };

        return React.createElement(
            this.props.component,
            {
                className: classNames(Classes.COLLAPSE, this.props.className),
                style: containerStyle,
            },
            <div
                className={Classes.COLLAPSE_BODY}
                ref={this.contentsRefHandler}
                style={contentsStyle}
                aria-hidden={!isContentVisible && this.props.keepChildrenMounted}
            >
                {shouldRenderChildren ? this.props.children : null}
            </div>,
        );
    }

    public componentDidMount() {
        this.forceUpdate();
        if (this.props.isOpen) {
            this.setState({ animationState: AnimationStates.OPEN, height: "auto" });
        } else {
            this.setState({ animationState: AnimationStates.CLOSED });
        }
    }

    public componentDidUpdate() {
        let height: number | undefined;

        if (this.contents != null && this.contents.clientHeight !== 0) {
            height = this.contents.clientHeight;
        }

        const { transitionDuration } = this.props;
        const { animationState } = this.state;

        if (animationState === AnimationStates.CLOSING_START) {
            this.setTimeout(() =>
                this.setState({
                    animationState: AnimationStates.CLOSING,
                    height: "0px",
                }),
            );
            this.setTimeout(() => this.onDelayedStateChange(), transitionDuration);
        } else if (animationState === AnimationStates.OPEN_START) {
            this.setState({
                animationState: AnimationStates.OPENING,
                height: height !== undefined ? `${height}px` : this.state.height,
            });
            this.setTimeout(() => this.onDelayedStateChange(), transitionDuration);
        }
    }

    private contentsRefHandler = (el: HTMLElement) => {
        this.contents = el;
        if (el != null) {
            this.setState({
                animationState: this.props.isOpen ? AnimationStates.OPEN : AnimationStates.CLOSED,
                height: `${this.contents.clientHeight}px`,
            });
        }
    };

    private onDelayedStateChange() {
        switch (this.state.animationState) {
            case AnimationStates.OPENING:
                this.setState({ animationState: AnimationStates.OPEN, height: "auto" });
                break;
            case AnimationStates.CLOSING:
                this.setState({ animationState: AnimationStates.CLOSED });
                break;
            default:
                break;
        }
    }
}
