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

import * as React from "react";

import type { IconName } from "@blueprintjs/icons";

import { Intent } from "./intent";

export const DISPLAYNAME_PREFIX = "Blueprint4";

/**
 * Alias for all valid HTML props for `<div>` element.
 * Does not include React's `ref` or `key`.
 */
export type HTMLDivProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Alias for all valid HTML props for `<input>` element.
 * Does not include React's `ref` or `key`.
 */
export type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Alias for a `JSX.Element` or a value that renders nothing.
 *
 * In React, `boolean`, `null`, and `undefined` do not produce any output.
 */
export type MaybeElement = JSX.Element | false | null | undefined;

/**
 * A shared base interface for all Blueprint component props.
 *
 * @deprecated use Props
 */
export interface IProps {
    /** A space-delimited list of class names to pass along to a child element. */
    className?: string;
}
// eslint-disable-next-line deprecation/deprecation
export type Props = IProps;

/** @deprecated use IntentProps */
export interface IIntentProps {
    /** Visual intent color to apply to element. */
    intent?: Intent;
}
// eslint-disable-next-line deprecation/deprecation
export type IntentProps = IIntentProps;

/**
 * Interface for a clickable action, such as a button or menu item.
 * These props can be spready directly to a `<Button>` or `<MenuItem>` element.
 *
 * @deprecated use ActionProps
 */
export interface IActionProps extends IntentProps, Props {
    /** Whether this action is non-interactive. */
    disabled?: boolean;

    /** Name of a Blueprint UI icon (or an icon element) to render before the text. */
    icon?: IconName | MaybeElement;

    /** Click event handler. */
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;

    /** Action text. Can be any single React renderable. */
    text?: React.ReactNode;
}
// eslint-disable-next-line deprecation/deprecation
export type ActionProps = IActionProps;

/**
 * Interface for a link, with support for customizing target window.
 *
 * @deprecated use LinkProps
 */
export interface ILinkProps {
    /** Link URL. */
    href?: string;

    /** Link target attribute. Use `"_blank"` to open in a new window. */
    target?: string;
}
// eslint-disable-next-line deprecation/deprecation
export type LinkProps = ILinkProps;

/**
 * Interface for a controlled input.
 *
 * @deprecated use ControlledProps2.
 */
export interface IControlledProps {
    /** Initial value of the input, for uncontrolled usage. */
    defaultValue?: string;

    /** Change event handler. Use `event.target.value` for new value. */
    onChange?: React.FormEventHandler<HTMLElement>;

    /** Form value of the input, for controlled usage. */
    value?: string;
}

export interface IControlledProps2 {
    /** Initial value of the input, for uncontrolled usage. */
    defaultValue?: string;

    /** Form value of the input, for controlled usage. */
    value?: string;
}
export type ControlledProps2 = IControlledProps2;

/**
 * @deprecated will be removed in Blueprint v5.0, where components will use `ref` prop instead
 */
export interface IElementRefProps<E extends HTMLElement> {
    /** A ref handler or a ref object that receives the native HTML element rendered by this component. */
    elementRef?: React.Ref<E>;
}

/**
 * An interface for an option in a list, such as in a `<select>` or `RadioGroup`.
 * These props can be spread directly to an `<option>` or `<Radio>` element.
 *
 * @deprecated use OptionProps
 */
export interface IOptionProps extends Props {
    /** Whether this option is non-interactive. */
    disabled?: boolean;

    /** Label text for this option. If omitted, `value` is used as the label. */
    label?: string;

    /** Value of this option. */
    value: string | number;
}
// eslint-disable-next-line deprecation/deprecation
export type OptionProps = IOptionProps;

/** A collection of curated prop keys used across our Components which are not valid HTMLElement props. */
const INVALID_PROPS = [
    "active",
    "alignText",
    "asyncControl", // IInputGroupProps2
    "containerRef",
    "current",
    "elementRef",
    "fill",
    "icon",
    "inputRef",
    "intent",
    "inline",
    "large",
    "loading",
    "leftElement",
    "leftIcon",
    "minimal",
    "onRemove", // ITagProps, ITagInputProps
    "outlined", // IButtonProps
    "panel", // ITabProps
    "panelClassName", // ITabProps
    "popoverProps",
    "rightElement",
    "rightIcon",
    "round",
    "small",
    "text",
];

/**
 * Typically applied to HTMLElements to filter out disallowed props. When applied to a Component,
 * can filter props from being passed down to the children. Can also filter by a combined list of
 * supplied prop keys and the denylist (only appropriate for HTMLElements).
 *
 * @param props The original props object to filter down.
 * @param {string[]} invalidProps If supplied, overwrites the default denylist.
 * @param {boolean} shouldMerge If true, will merge supplied invalidProps and denylist together.
 */
export function removeNonHTMLProps(
    props: { [key: string]: any },
    invalidProps = INVALID_PROPS,
    shouldMerge = false,
): { [key: string]: any } {
    if (shouldMerge) {
        invalidProps = invalidProps.concat(INVALID_PROPS);
    }

    return invalidProps.reduce(
        (prev, curr) => {
            // Props with hyphens (e.g. data-*) are always considered html props
            if (curr.indexOf("-") !== -1) {
                return prev;
            }

            if (prev.hasOwnProperty(curr)) {
                delete (prev as any)[curr];
            }
            return prev;
        },
        { ...props },
    );
}
