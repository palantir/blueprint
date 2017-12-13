/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
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

    /** Name of the icon (the part after `pt-icon-`) to render on left side of input. */
    leftIconName?: IconName;

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
    isActive: boolean;
}

@PureRender
export class InputGroup extends React.Component<HTMLInputProps & IInputGroupProps, IInputGroupState> {
    public static displayName = "Blueprint.InputGroup";

    public state: IInputGroupState = {
        isActive: false,
    };

    private rightElement: HTMLElement;
    private refHandlers = {
        rightElement: (ref: HTMLSpanElement) => (this.rightElement = ref),
    };

    public render() {
        const { className, intent, leftIconName } = this.props;
        const classes = classNames(
            Classes.INPUT_GROUP,
            Classes.intentClass(intent),
            {
                [Classes.DISABLED]: this.props.disabled,
                [Classes.ACTIVE]: this.state.isActive,
            },
            className,
        );

        return (
            <div className={classes}>
                <Icon iconName={leftIconName} iconSize={Icon.SIZE_STANDARD} />
                <input
                    type="text"
                    {...removeNonHTMLProps(this.props)}
                    className={Classes.INPUT}
                    onBlur={this.toggleFocus}
                    onFocus={this.toggleFocus}
                    ref={this.props.inputRef}
                />
                {this.maybeRenderRightElement()}
            </div>
        );
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

    private toggleFocus = () => {
        this.setState({ isActive: !this.state.isActive });
    };
}

export const InputGroupFactory = React.createFactory(InputGroup);
