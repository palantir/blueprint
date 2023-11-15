/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

type OmittedDOMAttributes = "children" | "dangerouslySetInnerHTML";

/**
 * Default set of DOM attributes which are assignable as props to the root element rendered by an
 * SVG icon component. This limited set of attributes is assignable to any `<Icon>` component regardless
 * of its `tagName` prop (it works for both HTML and SVG elements).
 */
export type DefaultSVGIconAttributes = React.AriaAttributes &
    Omit<React.DOMAttributes<Element>, OmittedDOMAttributes> &
    Pick<React.HTMLAttributes<Element>, "id" | "style" | "tabIndex" | "role">;

/**
 * DOM attributes which are assignable as props to the root element rendered by an SVG icon component.
 * Specify a type parameter to narrow this type and allow more attributes to be passed to the root element.
 *
 * @see https://blueprintjs.com/docs/#core/components/icon.dom-attributes
 *
 * When `tagName` is specified, either:
 *  - as a custom HTML element tag name,
 *  - as `null` to signfiy that there should be no wrapper around the `<svg>` element,
 *  - or its default value of "span" is used,
 * then it may be useful to narrow this type to pass along additional attributes which not supported by
 * the more general `DefaultSVGIconAttributes` interface. You can do this by specifying a generic type param
 * on `<Icon>` components, for example:
 *
 * ```
 * <Icon<HTMLSpanElement> icon="drag-handle-horizontal" draggable="false" />
 * ```
 */
export type SVGIconAttributes<T extends Element = Element> = T extends SVGElement
    ? Omit<React.SVGAttributes<T>, OmittedDOMAttributes>
    : T extends HTMLElement
    ? Omit<React.HTMLAttributes<T>, OmittedDOMAttributes>
    : DefaultSVGIconAttributes;

export interface SVGIconOwnProps {
    /** A space-delimited list of class names to pass along to the SVG element. */
    className?: string;

    /** This component does not support child nodes. */
    children?: never;

    /**
     * Color of icon. This is used as the `fill` attribute on the `<svg>` image
     * so it will override any CSS `color` property, including that set by
     * `intent`. If this prop is omitted, icon color is inherited from
     * surrounding text.
     */
    color?: string;

    /**
     * String for the `title` attribute on the rendered element, which will appear
     * on hover as a native browser tooltip.
     */
    htmlTitle?: string;

    /**
     * Size of the icon, in pixels. Blueprint contains 16px and 20px SVG icon
     * images, and chooses the appropriate resolution based on this prop.
     *
     * @default 16
     */
    size?: number;

    /** CSS style properties. */
    style?: React.CSSProperties;

    /**
     * HTML tag to use for the rendered element. Commonly "span" or "div".
     * If `null`, no wrapper will be rendered, just the `<svg>` element.
     *
     * @default "span"
     */
    tagName?: keyof JSX.IntrinsicElements | null;

    /**
     * Description string. This string does not appear in normal browsers, but
     * it increases accessibility. For instance, screen readers will use it for
     * aural feedback.
     *
     * If this value is nullish, `false`, or an empty string, the component will assume
     * that the icon is decorative and `aria-hidden="true"` will be applied (can be overridden
     * by manually passing `aria-hidden` prop).
     *
     * @see https://www.w3.org/WAI/tutorials/images/decorative/
     */
    title?: string | false | null;

    /** Props to apply to the `SVG` element */
    svgProps?: React.HTMLAttributes<SVGElement>;
}

// N.B. the following inteface is defined as a type alias instead of an interface due to a TypeScript limitation
// where interfaces cannot extend conditionally-defined union types.
/**
 * Interface for generated icon components which have their name and icon paths statically defined
 * inside their JS implementation.
 *
 * @see https://blueprintjs.com/docs/#core/components/icon.static-components
 */
export type SVGIconProps<T extends Element = Element> = React.RefAttributes<T> & SVGIconAttributes<T> & SVGIconOwnProps;

/**
 * The default SVG icon props interface, equivalent to `SVGIconProps` with its default type parameter.
 * This is primarly exported for documentation purposes; users should reference `SVGIconProps<T>` instead.
 */
export interface DefaultSVGIconProps extends React.RefAttributes<Element>, SVGIconAttributes<Element>, SVGIconOwnProps {
    // empty interface for documentation purposes (documentalist handles this better than the SVGIconProps<T> type alias)
}
