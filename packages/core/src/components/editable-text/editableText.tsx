/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
import { IIntentProps, IProps } from "../../common/props";
import { clamp, safeInvoke } from "../../common/utils";
import { Browser } from "../../compatibility";

export interface IEditableTextProps extends IIntentProps, IProps {
    /**
     * If `true` and in multiline mode, the `enter` key will trigger onConfirm and `mod+enter`
     * will insert a newline. If `false`, the key bindings are inverted such that `enter`
     * adds a newline.
     * @default false
     */
    confirmOnEnterKey?: boolean;

    /** Default text value of uncontrolled input. */
    defaultValue?: string;

    /**
     * Whether the text can be edited.
     * @default false
     */
    disabled?: boolean;

    /** Whether the component is currently being edited. */
    isEditing?: boolean;

    /** Maximum number of characters allowed. Unlimited by default. */
    maxLength?: number;

    /** Minimum width in pixels of the input, when not `multiline`. */
    minWidth?: number;

    /**
     * Whether the component supports multiple lines of text.
     * This prop should not be changed during the component's lifetime.
     * @default false
     */
    multiline?: boolean;

    /**
     * Maximum number of lines before scrolling begins, when `multiline`.
     */
    maxLines?: number;

    /**
     * Minimum number of lines (essentially minimum height), when `multiline`.
     * @default 1
     */
    minLines?: number;

    /**
     * Placeholder text when there is no value.
     * @default "Click to Edit"
     */
    placeholder?: string;

    /**
     * Whether the entire text field should be selected on focus.
     * If `false`, the cursor is placed at the end of the text.
     * @default false
     */
    selectAllOnFocus?: boolean;

    /** Text value of controlled input. */
    value?: string;

    /** Callback invoked when user cancels input with the `esc` key. Receives last confirmed value. */
    onCancel?(value: string): void;

    /** Callback invoked when user changes input in any way. */
    onChange?(value: string): void;

    /** Callback invoked when user confirms value with `enter` key or by blurring input. */
    onConfirm?(value: string): void;

    /** Callback invoked after the user enters edit mode. */
    onEdit?(value: string): void;
}

export interface IEditableTextState {
    /** Pixel height of the input, measured from span size */
    inputHeight?: number;
    /** Pixel width of the input, measured from span size */
    inputWidth?: number;
    /** Whether the value is currently being edited */
    isEditing?: boolean;
    /** The last confirmed value */
    lastValue?: string;
    /** The controlled input value, may be different from prop during editing */
    value?: string;
}

const BUFFER_WIDTH_EDGE = 5;
const BUFFER_WIDTH_IE = 30;

export class EditableText extends AbstractPureComponent<IEditableTextProps, IEditableTextState> {
    public static defaultProps: IEditableTextProps = {
        confirmOnEnterKey: false,
        defaultValue: "",
        disabled: false,
        maxLines: Infinity,
        minLines: 1,
        minWidth: 80,
        multiline: false,
        placeholder: "Click to Edit",
    };

    private valueElement: HTMLSpanElement;
    private refHandlers = {
        content: (spanElement: HTMLSpanElement) => {
            this.valueElement = spanElement;
        },
        input: (input: HTMLInputElement | HTMLTextAreaElement) => {
            if (input != null) {
                input.focus();
                const { length } = input.value;
                input.setSelectionRange(this.props.selectAllOnFocus ? 0 : length, length);
                if (!this.props.selectAllOnFocus) {
                    input.scrollLeft = input.scrollWidth;
                }
            }
        },
    };

    public constructor(props?: IEditableTextProps, context?: any) {
        super(props, context);

        const value = props.value == null ? props.defaultValue : props.value;
        this.state = {
            inputHeight: 0,
            inputWidth: 0,
            isEditing: props.isEditing === true && props.disabled === false,
            lastValue: value,
            value,
        };
    }

    public render() {
        const { disabled, multiline } = this.props;
        const value = this.props.value == null ? this.state.value : this.props.value;
        const hasValue = value != null && value !== "";

        const classes = classNames(
            Classes.EDITABLE_TEXT,
            Classes.intentClass(this.props.intent),
            {
                [Classes.DISABLED]: disabled,
                [Classes.EDITABLE_TEXT_EDITING]: this.state.isEditing,
                [Classes.EDITABLE_TEXT_PLACEHOLDER]: !hasValue,
                [Classes.MULTILINE]: multiline,
            },
            this.props.className,
        );

        let contentStyle: React.CSSProperties;
        if (multiline) {
            // set height only in multiline mode when not editing
            // otherwise we're measuring this element to determine appropriate height of text
            contentStyle = { height: !this.state.isEditing ? this.state.inputHeight : null };
        } else {
            // minWidth only applies in single line mode (multiline == width 100%)
            contentStyle = {
                height: this.state.inputHeight,
                lineHeight: this.state.inputHeight != null ? `${this.state.inputHeight}px` : null,
                minWidth: this.props.minWidth,
            };
        }

        // make enclosing div focusable when not editing, so it can still be tabbed to focus
        // (when editing, input itself is focusable so div doesn't need to be)
        const tabIndex = this.state.isEditing || disabled ? null : 0;
        return (
            <div className={classes} onFocus={this.handleFocus} tabIndex={tabIndex}>
                {this.maybeRenderInput(value)}
                <span className={Classes.EDITABLE_TEXT_CONTENT} ref={this.refHandlers.content} style={contentStyle}>
                    {hasValue ? value : this.props.placeholder}
                </span>
            </div>
        );
    }

    public componentDidMount() {
        this.updateInputDimensions();
    }

    public componentDidUpdate(_: IEditableTextProps, prevState: IEditableTextState) {
        if (this.state.isEditing && !prevState.isEditing) {
            safeInvoke(this.props.onEdit, this.state.value);
        }
        this.updateInputDimensions();
    }

    public componentWillReceiveProps(nextProps: IEditableTextProps) {
        const state: IEditableTextState = {};
        if (nextProps.value != null) {
            state.value = nextProps.value;
        }
        if (nextProps.isEditing != null) {
            state.isEditing = nextProps.isEditing;
        }
        if (nextProps.disabled || (nextProps.disabled == null && this.props.disabled)) {
            state.isEditing = false;
        }
        this.setState(state);
    }

    public cancelEditing = () => {
        const { lastValue, value } = this.state;
        this.setState({ isEditing: false, value: lastValue });
        if (value !== lastValue) {
            safeInvoke(this.props.onChange, lastValue);
        }
        safeInvoke(this.props.onCancel, lastValue);
    };

    public toggleEditing = () => {
        if (this.state.isEditing) {
            const { value } = this.state;
            this.setState({ isEditing: false, lastValue: value });
            safeInvoke(this.props.onConfirm, value);
        } else if (!this.props.disabled) {
            this.setState({ isEditing: true });
        }
    };

    private handleFocus = () => {
        if (!this.props.disabled) {
            this.setState({ isEditing: true });
        }
    };

    private handleTextChange = (event: React.FormEvent<HTMLElement>) => {
        const value = (event.target as HTMLInputElement).value;
        // state value should be updated only when uncontrolled
        if (this.props.value == null) {
            this.setState({ value });
        }
        safeInvoke(this.props.onChange, value);
    };

    private handleKeyEvent = (event: React.KeyboardEvent<HTMLElement>) => {
        const { altKey, ctrlKey, metaKey, shiftKey, which } = event;
        if (which === Keys.ESCAPE) {
            this.cancelEditing();
            return;
        }

        const hasModifierKey = altKey || ctrlKey || metaKey || shiftKey;
        if (which === Keys.ENTER) {
            // prevent IE11 from full screening with alt + enter
            // shift + enter adds a newline by default
            if (altKey || shiftKey) {
                event.preventDefault();
            }

            if (this.props.confirmOnEnterKey && this.props.multiline) {
                if (event.target != null && hasModifierKey) {
                    insertAtCaret(event.target as HTMLTextAreaElement, "\n");
                    this.handleTextChange(event);
                } else {
                    this.toggleEditing();
                }
            } else if (!this.props.multiline || hasModifierKey) {
                this.toggleEditing();
            }
        }
    };

    private maybeRenderInput(value: string) {
        const { maxLength, multiline, placeholder } = this.props;
        if (!this.state.isEditing) {
            return undefined;
        }
        const props: React.HTMLProps<HTMLInputElement | HTMLTextAreaElement> = {
            className: Classes.EDITABLE_TEXT_INPUT,
            maxLength,
            onBlur: this.toggleEditing,
            onChange: this.handleTextChange,
            onKeyDown: this.handleKeyEvent,
            placeholder,
            ref: this.refHandlers.input,
            style: {
                height: this.state.inputHeight,
                lineHeight: !multiline && this.state.inputHeight != null ? `${this.state.inputHeight}px` : null,
                width: multiline ? "100%" : this.state.inputWidth,
            },
            value,
        };
        return multiline ? <textarea {...props} /> : <input type="text" {...props} />;
    }

    private updateInputDimensions() {
        if (this.valueElement != null) {
            const { maxLines, minLines, minWidth, multiline } = this.props;
            const { parentElement, textContent } = this.valueElement;
            let { scrollHeight, scrollWidth } = this.valueElement;
            const lineHeight = getLineHeight(this.valueElement);
            // add one line to computed <span> height if text ends in newline
            // because <span> collapses that trailing whitespace but <textarea> shows it
            if (multiline && this.state.isEditing && /\n$/.test(textContent)) {
                scrollHeight += lineHeight;
            }
            if (lineHeight > 0) {
                // line height could be 0 if the isNaN block from getLineHeight kicks in
                scrollHeight = clamp(scrollHeight, minLines * lineHeight, maxLines * lineHeight);
            }
            // Chrome's input caret height misaligns text so the line-height must be larger than font-size.
            // The computed scrollHeight must also account for a larger inherited line-height from the parent.
            scrollHeight = Math.max(scrollHeight, getFontSize(this.valueElement) + 1, getLineHeight(parentElement));
            // IE11 & Edge needs a small buffer so text does not shift prior to resizing
            if (Browser.isEdge()) {
                scrollWidth += BUFFER_WIDTH_EDGE;
            } else if (Browser.isInternetExplorer()) {
                scrollWidth += BUFFER_WIDTH_IE;
            }
            this.setState({
                inputHeight: scrollHeight,
                inputWidth: Math.max(scrollWidth, minWidth),
            });
            // synchronizes the ::before pseudo-element's height while editing for Chrome 53
            if (multiline && this.state.isEditing) {
                this.setTimeout(() => (parentElement.style.height = `${scrollHeight}px`));
            }
        }
    }
}

function getFontSize(element: HTMLElement) {
    const fontSize = getComputedStyle(element).fontSize;
    return fontSize === "" ? 0 : parseInt(fontSize.slice(0, -2), 10);
}

function getLineHeight(element: HTMLElement) {
    // getComputedStyle() => 18.0001px => 18
    let lineHeight = parseInt(getComputedStyle(element).lineHeight.slice(0, -2), 10);
    // this check will be true if line-height is a keyword like "normal"
    if (isNaN(lineHeight)) {
        // @see http://stackoverflow.com/a/18430767/6342931
        const line = document.createElement("span");
        line.innerHTML = "<br>";
        element.appendChild(line);
        const singleLineHeight = element.offsetHeight;
        line.innerHTML = "<br><br>";
        const doubleLineHeight = element.offsetHeight;
        element.removeChild(line);
        // this can return 0 in edge cases
        lineHeight = doubleLineHeight - singleLineHeight;
    }
    return lineHeight;
}

function insertAtCaret(el: HTMLTextAreaElement, text: string) {
    const { selectionEnd, selectionStart, value } = el;
    if (selectionStart >= 0) {
        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd, value.length);
        const len = text.length;
        el.value = `${before}${text}${after}`;
        el.selectionStart = selectionStart + len;
        el.selectionEnd = selectionStart + len;
    }
}
