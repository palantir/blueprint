/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent2, Classes, Keys } from "../../common";
import { DISPLAYNAME_PREFIX, IntentProps, Props } from "../../common/props";
import { clamp } from "../../common/utils";
import { Browser } from "../../compatibility";

// eslint-disable-next-line deprecation/deprecation
export type EditableTextProps = IEditableTextProps;
/** @deprecated use EditableTextProps */
export interface IEditableTextProps extends IntentProps, Props {
    /**
     * EXPERIMENTAL FEATURE.
     *
     * When true, this forces the component to _always_ render an editable input (or textarea)
     * both when the component is focussed and unfocussed, instead of the component's default
     * behavior of switching between a text span and a text input upon interaction.
     *
     * This behavior can help in certain applications where, for example, a custom right-click
     * context menu is used to supply clipboard copy and paste functionality.
     *
     * @default false
     */
    alwaysRenderInput?: boolean;

    /**
     * If `true` and in multiline mode, the `enter` key will trigger onConfirm and `mod+enter`
     * will insert a newline. If `false`, the key bindings are inverted such that `enter`
     * adds a newline.
     *
     * @default false
     */
    confirmOnEnterKey?: boolean;

    /** Default text value of uncontrolled input. */
    defaultValue?: string;

    /**
     * Whether the text can be edited.
     *
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
     *
     * @default false
     */
    multiline?: boolean;

    /**
     * Maximum number of lines before scrolling begins, when `multiline`.
     */
    maxLines?: number;

    /**
     * Minimum number of lines (essentially minimum height), when `multiline`.
     *
     * @default 1
     */
    minLines?: number;

    /**
     * Placeholder text when there is no value.
     *
     * @default "Click to Edit"
     */
    placeholder?: string;

    /**
     * Whether the entire text field should be selected on focus.
     * If `false`, the cursor is placed at the end of the text.
     * This prop is ignored on inputs with type other then text, search, url, tel and password. See https://html.spec.whatwg.org/multipage/input.html#do-not-apply for details.
     *
     * @default false
     */
    selectAllOnFocus?: boolean;

    /**
     * The type of input that should be shown, when not `multiline`.
     */
    type?: string;

    /** Text value of controlled input. */
    value?: string;

    /** Callback invoked when user cancels input with the `esc` key. Receives last confirmed value. */
    onCancel?(value: string): void;

    /** Callback invoked when user changes input in any way. */
    onChange?(value: string): void;

    /** Callback invoked when user confirms value with `enter` key or by blurring input. */
    onConfirm?(value: string): void;

    /** Callback invoked after the user enters edit mode. */
    onEdit?(value: string | undefined): void;
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

const BUFFER_WIDTH_DEFAULT = 5;
const BUFFER_WIDTH_IE = 30;

@polyfill
export class EditableText extends AbstractPureComponent2<EditableTextProps, IEditableTextState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.EditableText`;

    public static defaultProps: EditableTextProps = {
        alwaysRenderInput: false,
        confirmOnEnterKey: false,
        defaultValue: "",
        disabled: false,
        maxLines: Infinity,
        minLines: 1,
        minWidth: 80,
        multiline: false,
        placeholder: "Click to Edit",
        type: "text",
    };

    private inputElement: HTMLInputElement | HTMLTextAreaElement | null = null;

    private valueElement: HTMLSpanElement | null = null;

    private refHandlers = {
        content: (spanElement: HTMLSpanElement | null) => {
            this.valueElement = spanElement;
        },
        input: (input: HTMLInputElement | HTMLTextAreaElement | null) => {
            if (input != null) {
                this.inputElement = input;

                // temporary fix for #3882
                if (!this.props.alwaysRenderInput) {
                    this.inputElement.focus();
                }

                if (this.state != null && this.state.isEditing) {
                    const supportsSelection = inputSupportsSelection(input);
                    if (supportsSelection) {
                        const { length } = input.value;
                        input.setSelectionRange(this.props.selectAllOnFocus ? 0 : length, length);
                    }
                    if (!supportsSelection || !this.props.selectAllOnFocus) {
                        input.scrollLeft = input.scrollWidth;
                    }
                }
            }
        },
    };

    public constructor(props: EditableTextProps, context?: any) {
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
        const { alwaysRenderInput, disabled, multiline } = this.props;
        const value = this.props.value ?? this.state.value;
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
            contentStyle = { height: !this.state.isEditing ? this.state.inputHeight : undefined };
        } else {
            // minWidth only applies in single line mode (multiline == width 100%)
            contentStyle = {
                height: this.state.inputHeight,
                lineHeight: this.state.inputHeight != null ? `${this.state.inputHeight}px` : undefined,
                minWidth: this.props.minWidth,
            };
        }

        // If we are always rendering an input, then NEVER make the container div focusable.
        // Otherwise, make container div focusable when not editing, so it can still be tabbed
        // to focus (when the input is rendered, it is itself focusable so container div doesn't need to be)
        const tabIndex = alwaysRenderInput || this.state.isEditing || disabled ? undefined : 0;

        // we need the contents to be rendered while editing so that we can measure their height
        // and size the container element responsively
        const shouldHideContents = alwaysRenderInput && !this.state.isEditing;

        return (
            <div className={classes} onFocus={this.handleFocus} tabIndex={tabIndex}>
                {alwaysRenderInput || this.state.isEditing ? this.renderInput(value) : undefined}
                {shouldHideContents ? undefined : (
                    <span className={Classes.EDITABLE_TEXT_CONTENT} ref={this.refHandlers.content} style={contentStyle}>
                        {hasValue ? value : this.props.placeholder}
                    </span>
                )}
            </div>
        );
    }

    public componentDidMount() {
        this.updateInputDimensions();
    }

    public componentDidUpdate(prevProps: EditableTextProps, prevState: IEditableTextState) {
        const newState: IEditableTextState = {};
        // allow setting the value to undefined/null in controlled mode
        if (this.props.value !== prevProps.value && (prevProps.value != null || this.props.value != null)) {
            newState.value = this.props.value;
        }
        if (this.props.isEditing != null && this.props.isEditing !== prevProps.isEditing) {
            newState.isEditing = this.props.isEditing;
        }
        if (this.props.disabled || (this.props.disabled == null && prevProps.disabled)) {
            newState.isEditing = false;
        }

        this.setState(newState);

        if (this.state.isEditing && !prevState.isEditing) {
            this.props.onEdit?.(this.state.value);
        }
        // updateInputDimensions is an expensive method. Call it only when the props
        // it depends on change
        if (
            this.state.value !== prevState.value ||
            this.props.alwaysRenderInput !== prevProps.alwaysRenderInput ||
            this.props.maxLines !== prevProps.maxLines ||
            this.props.minLines !== prevProps.minLines ||
            this.props.minWidth !== prevProps.minWidth ||
            this.props.multiline !== prevProps.multiline
        ) {
            this.updateInputDimensions();
        }
    }

    public cancelEditing = () => {
        const { lastValue, value } = this.state;
        this.setState({ isEditing: false, value: lastValue });
        if (value !== lastValue) {
            this.props.onChange?.(lastValue!);
        }
        this.props.onCancel?.(lastValue!);
    };

    public toggleEditing = () => {
        if (this.state.isEditing) {
            const { value } = this.state;
            this.setState({ isEditing: false, lastValue: value });
            this.props.onConfirm?.(value!);
        } else if (!this.props.disabled) {
            this.setState({ isEditing: true });
        }
    };

    private handleFocus = () => {
        const { alwaysRenderInput, disabled, selectAllOnFocus } = this.props;

        if (!disabled) {
            this.setState({ isEditing: true });
        }

        if (alwaysRenderInput && selectAllOnFocus && this.inputElement != null) {
            const { length } = this.inputElement.value;
            this.inputElement.setSelectionRange(0, length);
        }
    };

    private handleTextChange = (event: React.FormEvent<HTMLElement>) => {
        const value = (event.target as HTMLInputElement).value;
        // state value should be updated only when uncontrolled
        if (this.props.value == null) {
            this.setState({ value });
        }
        this.props.onChange?.(value);
    };

    private handleKeyEvent = (event: React.KeyboardEvent<HTMLElement>) => {
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        /* eslint-disable-next-line deprecation/deprecation */
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

    private renderInput(value: string | undefined) {
        const { disabled, maxLength, multiline, type, placeholder } = this.props;
        const props: React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> = {
            className: Classes.EDITABLE_TEXT_INPUT,
            disabled,
            maxLength,
            onBlur: this.toggleEditing,
            onChange: this.handleTextChange,
            onKeyDown: this.handleKeyEvent,
            placeholder,
            value,
        };

        const { inputHeight, inputWidth } = this.state;
        if (inputHeight !== 0 && inputWidth !== 0) {
            props.style = {
                height: inputHeight,
                lineHeight: !multiline && inputHeight != null ? `${inputHeight}px` : undefined,
                width: multiline ? "100%" : inputWidth,
            };
        }

        return multiline ? (
            <textarea ref={this.refHandlers.input} {...props} />
        ) : (
            <input ref={this.refHandlers.input} type={type} {...props} />
        );
    }

    private updateInputDimensions() {
        if (this.valueElement != null) {
            const { maxLines, minLines, minWidth, multiline } = this.props;
            const { parentElement, textContent } = this.valueElement;
            let { scrollHeight, scrollWidth } = this.valueElement;
            const lineHeight = getLineHeight(this.valueElement);
            // add one line to computed <span> height if text ends in newline
            // because <span> collapses that trailing whitespace but <textarea> shows it
            if (multiline && this.state.isEditing && /\n$/.test(textContent ?? "")) {
                scrollHeight += lineHeight;
            }
            if (lineHeight > 0) {
                // line height could be 0 if the isNaN block from getLineHeight kicks in
                scrollHeight = clamp(scrollHeight, minLines! * lineHeight, maxLines! * lineHeight);
            }
            // Chrome's input caret height misaligns text so the line-height must be larger than font-size.
            // The computed scrollHeight must also account for a larger inherited line-height from the parent.
            scrollHeight = Math.max(scrollHeight, getFontSize(this.valueElement) + 1, getLineHeight(parentElement!));
            // Need to add a small buffer so text does not shift prior to resizing, causing an infinite loop.
            // IE needs a larger buffer than other browsers.
            scrollWidth += Browser.isInternetExplorer() ? BUFFER_WIDTH_IE : BUFFER_WIDTH_DEFAULT;

            this.setState({
                inputHeight: scrollHeight,
                inputWidth: Math.max(scrollWidth, minWidth!),
            });
            // synchronizes the ::before pseudo-element's height while editing for Chrome 53
            if (multiline && this.state.isEditing) {
                this.setTimeout(() => (parentElement!.style.height = `${scrollHeight}px`));
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

function inputSupportsSelection(input: HTMLInputElement | HTMLTextAreaElement) {
    switch (input.type) {
        // HTMLTextAreaElement
        case "textarea":
            return true;
        // HTMLInputElement
        // see https://html.spec.whatwg.org/multipage/input.html#do-not-apply
        case "text":
        case "search":
        case "tel":
        case "url":
        case "password":
            return true;
        default:
            return false;
    }
}
