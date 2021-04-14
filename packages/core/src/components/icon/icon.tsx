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
import React from "react";

import { IconComponent, IconName, Icons, ICON_SIZE_STANDARD, ICON_SIZE_LARGE, SVGIconProps } from "@blueprintjs/icons";

import { AbstractPureComponent, Classes, DISPLAYNAME_PREFIX, IntentProps, Props, MaybeElement } from "../../common";

export { IconName };

export interface IconProps extends IntentProps, Props, SVGIconProps {
    /**
     * Whether the component should automatically load icon contents using an async import.
     *
     * @default true
     */
    autoLoad?: boolean;

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
}

interface IconState {
    iconComponent: IconComponent | undefined;
}

export class Icon extends AbstractPureComponent<
    IconProps & Omit<React.HTMLAttributes<HTMLElement>, "title">,
    IconState
> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Icon`;

    public static defaultProps: Partial<IconProps> = {
        autoLoad: true,
        tagName: "span",
    };

    public static readonly SIZE_STANDARD = ICON_SIZE_STANDARD;

    public static readonly SIZE_LARGE = ICON_SIZE_LARGE;

    public state: IconState = {
        iconComponent: undefined,
    };

    // this component may have unmounted by the time iconContents load, so make sure we don't try to setState
    private hasUnmounted = false;

    public async componentDidMount() {
        this.hasUnmounted = false;

        const { icon } = this.props;

        if (typeof icon === "string") {
            await this.loadIconComponentModule(icon);
        }
    }

    public async componentDidUpdate(prevProps: IconProps, _prevState: IconState) {
        const { icon } = this.props;

        if (prevProps.icon !== icon && typeof icon === "string") {
            // reload the module to get the component, but it will be cached if it's the same icon
            await this.loadIconComponentModule(icon);
        }
    }

    public componentWillUnmount() {
        this.hasUnmounted = true;
    }

    public render(): JSX.Element | null {
        const { icon } = this.props;
        if (icon == null || typeof icon === "boolean") {
            return null;
        } else if (typeof icon !== "string") {
            return icon;
        }

        // strip out props we don't want rendered to the DOM
        const {
            autoLoad,
            className,
            color,
            size,
            icon: _icon,
            intent,
            tagName,
            title = icon,
            htmlTitle = title,
            ...htmlProps
        } = this.props;
        const { iconComponent: Component } = this.state;

        if (Component == null) {
            // fall back to icon font if unloaded or unable to load SVG implementation
            return React.createElement(tagName!, {
                ...htmlProps,
                className: classNames(Classes.ICON, Classes.iconClass(icon), Classes.intentClass(intent), className),
                title: htmlTitle,
            });
        } else {
            return (
                <Component
                    className={classNames(Classes.intentClass(intent), className)}
                    color={color}
                    size={size}
                    tagName={tagName}
                    title={title}
                    htmlTitle={htmlTitle as string | undefined}
                    {...htmlProps}
                />
            );
        }
    }

    private async loadIconComponentModule(iconName: IconName) {
        if (this.props.autoLoad && !this.hasUnmounted) {
            // if it's already been loaded, this is a no-op
            await Icons.load(iconName);
        }

        const iconComponent = Icons.getComponent(iconName);
        this.setState({ iconComponent });
    }
}
