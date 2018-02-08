/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { HTMLInputProps, IControlledProps, IIntentProps, IProps, removeNonHTMLProps } from "../../common/props";
import { Icon, IconName } from "../icon/icon";

export interface IInputGroupProps extends IControlledProps, IIntentProps, IProps {
    /**
     * Whether the input is non-interactive.
     * Note that `rightElement` must be disabled separately; this prop will not affect it.
     * @default false
     */
    disabled?: boolean;

    /** Ref handler that receives HTML `<input>` element backing this component. */
    inputRef?: (ref: HTMLInputElement) => any;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render on the left side of the input group,
     * before the user's cursor.
     */
    leftIcon?: IconName | JSX.Element;

    /** Placeholder text in the absence of any value. */
    placeholder?: string;

    /**
     * Element to render on right side of input.
     * For best results, use a minimal button, tag, or small spinner.
     */
    rightElement?: JSX.Element;

    /**
     * HTML `input` type attribute.
     * @default "text"
     */
    type?: string;
}

export interface IInputGroupState {
    rightElementWidth?: number;
}

export class InputGroup extends React.PureComponent<HTMLInputProps & IInputGroupProps, IInputGroupState> {
    public static displayName = "Blueprint2.InputGroup";

    public state: IInputGroupState = {
        rightElementWidth: 30,
    };

    private rightElement: HTMLElement;
    private refHandlers = {
        rightElement: (ref: HTMLSpanElement) => (this.rightElement = ref),
    };

    public render() {
        const { className, intent, leftIcon } = this.props;
        const classes = classNames(
            Classes.INPUT_GROUP,
            Classes.intentClass(intent),
            {
                [Classes.DISABLED]: this.props.disabled,
            },
            className,
        );
        const style: React.CSSProperties = { ...this.props.style, paddingRight: this.state.rightElementWidth };

        return (
            <div className={classes}>
                <Icon icon={leftIcon} />
                <input
                    type="text"
                    {...removeNonHTMLProps(this.props)}
                    className={Classes.INPUT}
                    ref={this.props.inputRef}
                    style={style}
                />
                {this.maybeRenderRightElement()}
            </div>
        );
    }

    public componentDidMount() {
        this.updateInputWidth();
    }

    public componentDidUpdate() {
        this.updateInputWidth();
    }

    private maybeRenderRightElement() {
        const { rightElement } = this.props;
        if (rightElement == null) {
            return undefined;
        }
        return (
            <span className="pt-input-action" ref={this.refHandlers.rightElement}>
                {rightElement}
            </span>
        );
    }

    private updateInputWidth() {
        if (this.rightElement != null) {
            const { clientWidth } = this.rightElement;
            // small threshold to prevent infinite loops
            if (Math.abs(clientWidth - this.state.rightElementWidth) > 2) {
                this.setState({ rightElementWidth: clientWidth });
            }
        } else {
            this.setState({ rightElementWidth: 0 });
        }
    }
}
