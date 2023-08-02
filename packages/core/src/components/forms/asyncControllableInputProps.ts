/* !
 * (c) Copyright 2023 Palantir Technologies Inc. All rights reserved.
 */

export type InputTagName = "input" | "textarea";

export type AsyncControllableElement<T extends InputTagName> = T extends "input"
    ? HTMLInputElement
    : T extends "textarea"
    ? HTMLTextAreaElement
    : never;

type AsyncControllableElementAttributes<T extends InputTagName> = T extends "input"
    ? React.InputHTMLAttributes<HTMLInputElement>
    : T extends "textarea"
    ? React.TextareaHTMLAttributes<HTMLTextAreaElement>
    : never;

export type AsyncControllableInputValue<T extends InputTagName> = AsyncControllableElementAttributes<T>["value"];

export type AsyncControllableInputProps<T extends InputTagName = "input"> = Omit<
    AsyncControllableElementAttributes<T>,
    "onChange" | "onCompositionStart" | "onCompositionEnd"
> & {
    /**
     * HTML tag name to use for rendered input element.
     *
     * @default "input"
     */
    tagName?: T;
    inputRef?: React.Ref<AsyncControllableElement<T>>;

    // NOTE: these are copied from the React.HTMLAttributes interface definition.
    onChange?: React.ChangeEventHandler<AsyncControllableElement<T>> | undefined;
    onCompositionStart?: React.CompositionEventHandler<AsyncControllableElement<T>> | undefined;
    onCompositionEnd?: React.CompositionEventHandler<AsyncControllableElement<T>> | undefined;
};
