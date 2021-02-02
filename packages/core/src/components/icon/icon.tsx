/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { IconName, Icons, ICON_SIZE_STANDARD, ICON_SIZE_LARGE } from "@blueprintjs/icons";

import { AbstractPureComponent2, Classes, DISPLAYNAME_PREFIX, IIntentProps, IProps, MaybeElement } from "../../common";
// TODO(adahiya)
// import { iconNameToPathsRecordKey } from "./iconUtils";

export { IconName };

export interface IIconProps extends IIntentProps, IProps {
    /**
     * Whether the component should automatically load icon contents using an async import.
     *
     * @default true
     */
    autoLoad?: boolean;

    /** This component does not support custom children. Use the `icon` prop. */
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
     * Name of a Blueprint UI icon, or an icon element, to render. This prop is
     * required because it determines the content of the component, but it can
     * be explicitly set to falsy values to render nothing.
     *
     * - If `null` or `undefined` or `false`, this component will render nothing.
     * - If given an `IconName` (a string literal union of all icon names), that
     *   icon will be rendered as an `<svg>` with `<path>` tags. Unknown strings
     *   will render a blank icon to occupy space.
     * - If given a `JSX.Element`, that element will be rendered and _all other
     *   props on this component are ignored._ This type is supported to
     *   simplify icon support in other Blueprint components. As a consumer, you
     *   should avoid using `<Icon icon={<Element />}` directly; simply render
     *   `<Element />` instead.
     */
    icon: IconName | MaybeElement;

    /**
     * Size of the icon, in pixels. Blueprint contains 16px and 20px SVG icon
     * images, and chooses the appropriate resolution based on this prop.
     *
     * @default Icon.SIZE_STANDARD = 16
     */
    iconSize?: number;

    /** CSS style properties. */
    style?: React.CSSProperties;

    /**
     * HTML tag to use for the rendered element.
     *
     * @default "span"
     */
    tagName?: keyof JSX.IntrinsicElements;

    /**
     * Description string. This string does not appear in normal browsers, but
     * it increases accessibility. For instance, screen readers will use it for
     * aural feedback. By default, this is set to the icon's name. Pass an
     * explicit falsy value to disable.
     */
    title?: string | false | null;
}

interface IIconState {
    /**
     * Icon contents path string
     */
    iconContents: [string, string] | undefined;
}

@polyfill
export class Icon extends AbstractPureComponent2<IIconProps & React.DOMAttributes<HTMLElement>, IIconState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Icon`;

    public static defaultProps: Partial<IIconProps> = {
        autoLoad: true,
    };

    public static readonly SIZE_STANDARD = ICON_SIZE_STANDARD;

    public static readonly SIZE_LARGE = ICON_SIZE_LARGE;

    public state: IIconState = {
        iconContents: undefined,
    };

    // this component may have unmounted by the time iconContents load, so make sure we don't try to setState
    private hasUnmounted = false;

    public async componentDidMount() {
        this.hasUnmounted = false;

        const { icon } = this.props;

        if (typeof icon === "string") {
            await this.loadAndSetIconContents(icon);
        }
    }

    public async componentDidUpdate(prevProps: IIconProps, _prevState: IIconState) {
        const { icon } = this.props;

        if (prevProps.icon !== icon && typeof icon === "string") {
            // reload the module to get the component, but it will be cached if it's the same icon
            await this.loadAndSetIconContents(icon);
        }
    }

    public render(): JSX.Element | null {
        const { icon } = this.props;
        if (icon == null || typeof icon === "boolean") {
            return null;
        } else if (typeof icon !== "string") {
            return icon;
        }

        const {
            autoLoad,
            className,
            color,
            htmlTitle,
            iconSize = Icon.SIZE_STANDARD,
            intent,
            title = icon,
            tagName = "span",
            ...htmlprops
        } = this.props;

        // choose which pixel grid is most appropriate for given icon size
        const pixelGridSize = iconSize >= Icon.SIZE_LARGE ? Icon.SIZE_LARGE : Icon.SIZE_STANDARD;
        const classes = classNames(Classes.ICON, Classes.iconClass(icon), Classes.intentClass(intent), className);
        const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`;

        return React.createElement(
            tagName,
            {
                ...htmlprops,
                className: classes,
                title: htmlTitle,
            },
            <svg fill={color} data-icon={icon} width={iconSize} height={iconSize} viewBox={viewBox}>
                {title && <desc>{title}</desc>}
                {this.renderSvgPath(iconSize)}
            </svg>,
        );
    }

    /**
     * Render `<path>` elements for the given icon name.
     * Returns `null` if name is unknown or icon contents have not yet been loaded.
     * You can load icons using the APIs found in { Icons } from "@blueprintjs/icons"
     */
    private renderSvgPath(pathsSize: number): JSX.Element | null {
        const { iconContents } = this.state;

        if (iconContents === undefined) {
            return null;
        }

        const [icon16, icon20] = iconContents;

        return <path d={pathsSize < Icon.SIZE_LARGE ? icon16 : icon20} fillRule="evenodd" />;
    }

    private async loadAndSetIconContents(iconName: IconName) {
        if (this.props.autoLoad && !this.hasUnmounted) {
            // if it's already been loaded, this is a no-op
            await Icons.load(iconName);
        }

        const iconContents = Icons.getContents(iconName);
        this.setState({ iconContents });
    }
}
