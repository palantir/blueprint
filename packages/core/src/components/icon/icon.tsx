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
import React, { forwardRef, useEffect, useState } from "react";

import { IconComponent, IconName, Icons, IconSize, SVGIconProps } from "@blueprintjs/icons";

import { Classes, DISPLAYNAME_PREFIX, IntentProps, Props, MaybeElement } from "../../common";

// re-export for convenience, since some users won't be importing from or have a direct dependency on the icons package
export { IconName, IconSize };

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

export const Icon: React.FC<IconProps & Omit<React.HTMLAttributes<HTMLElement>, "title">> = forwardRef<any, IconProps>(
    (props, ref) => {
        const { icon } = props;
        if (icon == null || typeof icon === "boolean") {
            return null;
        } else if (typeof icon !== "string") {
            return icon;
        }

        const {
            autoLoad,
            className,
            color,
            size,
            icon: _icon,
            intent,
            tagName,
            title,
            htmlTitle,
            ...htmlProps
        } = props;
        const [Component, setIconComponent] = useState<IconComponent>();

        useEffect(() => {
            let shouldCancelIconLoading = false;
            if (typeof icon === "string") {
                if (autoLoad) {
                    // load the module to get the component (it will be cached if it's the same icon)
                    Icons.load(icon).then(() => {
                        // if this effect expired by the time icon loaded, then don't set state
                        if (!shouldCancelIconLoading) {
                            setIconComponent(Icons.getComponent(icon));
                        }
                    });
                } else {
                    setIconComponent(Icons.getComponent(icon));
                }
            }
            return () => {
                shouldCancelIconLoading = true;
            };
        }, [autoLoad, icon]);

        if (Component == null) {
            // fall back to icon font if unloaded or unable to load SVG implementation
            return React.createElement(tagName!, {
                ...htmlProps,
                "aria-hidden": title ? undefined : true,
                className: classNames(Classes.ICON, Classes.iconClass(icon), Classes.intentClass(intent), className),
                ref,
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
                    htmlTitle={htmlTitle}
                    ref={ref}
                    {...htmlProps}
                />
            );
        }
    },
);
Icon.defaultProps = {
    autoLoad: true,
    size: IconSize.STANDARD,
    tagName: "span",
};
Icon.displayName = `${DISPLAYNAME_PREFIX}.Icon`;
