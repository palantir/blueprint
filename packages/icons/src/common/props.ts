/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IconName } from "./iconName";
import { Intent } from "./intent";
import { SVGIcon } from "./svgIcon";

/**
 * A shared base interface for all Blueprint component props.
 */
export interface IProps {
    /** A space-delimited list of class names to pass along to a child element. */
    className?: string;
}

export interface IIntentProps {
    /** Visual intent color to apply to element. */
    intent?: Intent;
}

export interface IIconBaseProps extends IIntentProps, IProps {
    /** This component does not support custom children. Use the `icon` prop. */
    children?: never;

    /**
     * Color of icon. Equivalent to setting CSS `fill` property.
     */
    color?: string;

    /**
     * Size of the icon, in pixels.
     * Blueprint contains 16px and 20px SVG icon images,
     * and chooses the appropriate resolution based on this prop.
     * @default Icon.SIZE_STANDARD = 16
     */
    iconSize?: number;

    /** CSS style properties. */
    style?: React.CSSProperties;

    /**
     * Description string.
     * Browsers usually render this as a tooltip on hover, whereas screen
     * readers will use it for aural feedback.
     * By default, this is set to the icon's name for accessibility.
     */
    title?: string | false | null;
}

export interface IIconProps extends IIconBaseProps {
    /**
     * Name of a Blueprint UI icon, or an icon element, to render.
     * This prop is required because it determines the content of the component, but it can
     * be explicitly set to falsy values to render nothing.
     *
     * - If `null` or `undefined` or `false`, this component will render nothing.
     * - If given an `IconName` (a string literal union of all icon names) or an `SVGIcon`,
     *   that icon will be rendered as an `<svg>` with `<path>` tags.
     * - If given a `JSX.Element`, that element will be rendered and _all other props on this component are ignored._
     *   This type is supported to simplify usage of this component in other Blueprint components.
     *   As a consumer, you should never use `<Icon icon={<element />}` directly; simply render `<element />` instead.
     */
    icon: IconName | SVGIcon | JSX.Element | false | null | undefined;
}
