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

export interface SVGIconProps {
    /** A space-delimited list of class names to pass along to the SVG element. */
    className?: string;

    /** This component does not support custom children. */
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
     * on hover as a native browser tooltip. Defaults to the title prop.
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
     * Description string. This string does not appear in normal browsers, but
     * it increases accessibility. For instance, screen readers will use it for
     * aural feedback. By default, this is set to the icon's name. Pass an
     * explicit falsy value to disable.
     */
    title?: string | false | null;

    /**
     * HTML tag to use for the rendered element. Commonly "span" or "div".
     * If `null`, no wrapper will be rendered, just the <svg>.
     *
     * @default "span"
     */
    tagName?: keyof JSX.IntrinsicElements | null;
}
