/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import { HTMLInputProps, IControlledProps, IIntentProps, IProps, removeNonHTMLProps } from "../../common/props";

export interface IInputGroupProps extends IControlledProps, IIntentProps, IProps {
    /**
     * Whether the input is non-interactive.
     * Note that `rightElement` must be disabled separately; this prop will not affect it.
     * @default false
     */
    disabled?: boolean;

    /** Ref handler that receives HTML `<input>` element backing this component. */
    inputRef?: (ref: HTMLInputElement) => any;

    /** Name of icon (the part after `pt-icon-`) to render on left side of input. */
    leftIconName?: string;

    /** Placeholder text in the absence of any value. */
    placeholder?: string;

    /**
     * Element to render on right side of input.
     * For best results, use a minimal button or a tag.
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

@PureRender
export class InputGroup extends React.Component<HTMLInputProps & IInputGroupProps, IInputGroupState> {
    public static displayName = "Blueprint.InputGroup";

    public state: IInputGroupState = {
        rightElementWidth: 30,
    };

    private rightElement: HTMLElement;
    private refHandlers = {
        rightElement: (ref: HTMLSpanElement) => this.rightElement = ref,
    };

    public render() {
        const { className, intent, leftIconName, rightElement } = this.props;
        const classes = classNames(Classes.INPUT_GROUP, Classes.intentClass(intent), {
            [Classes.DISABLED]: this.props.disabled,
        }, className);
        const style: React.CSSProperties = { paddingRight: this.state.rightElementWidth };

        return (
            <div className={classes}>
                { leftIconName == null ? undefined
                    : <span className={`pt-icon ${Classes.iconClass(leftIconName)}`} /> }

                <input
                    type="text"
                    {...removeNonHTMLProps(this.props)}
                    className={Classes.INPUT}
                    ref={this.props.inputRef}
                    style={style}
                />

                { rightElement == null ? undefined
                    : <span className="pt-input-action" ref={this.refHandlers.rightElement}>{rightElement}</span> }
            </div>
        );
    }

    public componentDidMount() {
        this.updateInputWidth();
    }

    public componentDidUpdate() {
        this.updateInputWidth();
    }

    private updateInputWidth() {
        if (this.rightElement != null) {
            const { clientWidth } = this.rightElement;
            // small threshold to prevent infinite loops
            if (Math.abs(clientWidth - this.state.rightElementWidth) > 2) {
                this.setState({ rightElementWidth: clientWidth });
            }
        }
    }
}

export const InputGroupFactory = React.createFactory(InputGroup);
