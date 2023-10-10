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

import type * as React from "react";

import type { IconName } from "@blueprintjs/icons";

import type { Intent } from "./intent";

export const DISPLAYNAME_PREFIX = "Blueprint5";

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
 */
export interface Props {
    /** A space-delimited list of class names to pass along to a child element. */
    className?: string;
}

export interface IntentProps {
    /** Visual intent color to apply to element. */
    intent?: Intent;
}

/**
 * Interface for a clickable action, such as a button or menu item.
 * These props can be spready directly to a `<Button>` or `<MenuItem>` element.
 *
 * @template T type of the DOM element rendered by this component
 */
export interface ActionProps<T extends HTMLElement = HTMLElement> extends IntentProps, Props {
    /** Whether this action is non-interactive. */
    disabled?: boolean;

    /** Name of a Blueprint UI icon (or an icon element) to render before the text. */
    icon?: IconName | MaybeElement;

    /** Click event handler. */
    onClick?: (event: React.MouseEvent<T>) => void;

    /** Focus event handler. */
    onFocus?: (event: React.FocusEvent<T>) => void;

    /** Action text. Can be any single React renderable. */
    text?: React.ReactNode;
}

/** Interface for a link, with support for customizing target window. */
export interface LinkProps {
    /** Link URL. */
    href?: string;

    /** Link target attribute. Use `"_blank"` to open in a new window. */
    target?: React.HTMLAttributeAnchorTarget;
}

/**
 * Interface for a controlled input.
 */
export interface ControlledProps {
    /** Initial value of the input, for uncontrolled usage. */
    defaultValue?: string;

    /** Form value of the input, for controlled usage. */
    value?: string;
}

export interface OptionProps extends Props {
    /** Whether this option is non-interactive. */
    disabled?: boolean;

    /** Label text for this option. If omitted, `value` is used as the label. */
    label?: string;

    /** Value of this option. */
    value: string | number;
}

/** A collection of curated prop keys used across our Components which are not valid HTMLElement props. */
const INVALID_PROPS = [
    "active",
    "alignText",
    "asyncControl", // InputGroupProps
    "containerRef",
    "current",
    "elementRef", // not used anymore in Blueprint v5.x, but kept for backcompat if consumers use this naming pattern
    "fill",
    "icon",
    "iconSize",
    "inputClassName",
    "inputRef",
    "intent",
    "inline",
    "large",
    "loading",
    "leftElement",
    "leftIcon",
    "minimal",
    "onRemove", // TagProps, TagInputProps
    "outlined", // ButtonProps
    "panel", // TabProps
    "panelClassName", // TabProps
    "popoverProps",
    "rightElement",
    "rightIcon",
    "round",
    "size",
    "small",
    "tagName",
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
