/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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
import { createElement, forwardRef, useEffect, useState } from "react";

import {
    type DefaultSVGIconProps,
    type IconNextName,
    type IconPaths,
    IconSize,
    IconsNext,
    type NextIconVariant,
    SvgIconContainerNext,
    type SVGIconProps,
} from "@blueprintjs/icons/next";

import { Classes, DISPLAYNAME_PREFIX, type IntentProps, type MaybeElement, type Props } from "../../common";

export interface IconNextOwnProps {
    /**
     * Whether the component should automatically load icon contents using an async import.
     *
     * @default true
     */
    autoLoad?: boolean;

    /**
     * Name of a next-generation Blueprint UI icon, or an icon element, to render.
     *
     * - If `null` or `undefined` or `false`, this component will render nothing.
     * - If given a `IconNextName` string, that icon will be rendered as an `<svg>` with `<path>` tags.
     * - If given a `React.JSX.Element`, that element will be rendered and all other props are ignored.
     */
    icon: IconNextName | MaybeElement;

    /**
     * Icon variant. Next icons support outlined (default) and filled variants.
     * If `"filled"` is requested but unavailable for this icon, falls back to `"outlined"`.
     *
     * @default "outlined"
     */
    variant?: NextIconVariant;
}

export type IconNextProps<T extends Element = Element> = IntentProps & Props & SVGIconProps<T> & IconNextOwnProps;

/**
 * The default `<IconNext>` props interface, equivalent to `IconNextProps` with its default type parameter.
 * This is primarily exported for documentation purposes; users should reference `IconNextProps<T>` instead.
 */
export interface DefaultIconNextProps extends IntentProps, Props, DefaultSVGIconProps, IconNextOwnProps {
    // empty interface for documentation purposes (documentalist handles this better than the IconNextProps<T> type alias)
}

export interface IconNextComponent extends React.FC<IconNextProps<Element>> {
    <T extends Element = Element>(props: IconNextProps<T>): React.ReactNode;
}

/**
 * Next-generation icon component. Renders icons from `@blueprintjs/icons/next` with
 * dynamic loading support and outlined/filled variant switching.
 *
 * @see https://blueprintjs.com/docs/#core/components/icon
 */
export const IconNext: IconNextComponent = forwardRef(
    <T extends Element>(props: IconNextProps<T>, ref: React.Ref<T>) => {
        const {
            autoLoad = true,
            className,
            color,
            htmlTitle,
            icon,
            intent,
            size = IconSize.STANDARD,
            svgProps,
            tagName = "span",
            title,
            variant = "outlined",
            ...htmlProps
        } = props;

        const [iconPaths, setIconPaths] = useState<IconPaths | undefined>(() =>
            typeof icon === "string" ? IconsNext.getPaths(icon, variant) : undefined,
        );

        useEffect(() => {
            let cancelled = false;
            if (typeof icon === "string") {
                const cached = IconsNext.getPaths(icon, variant);

                if (cached !== undefined) {
                    setIconPaths(cached);
                } else if (autoLoad) {
                    IconsNext.load(icon, variant)
                        .then(() => {
                            if (!cancelled) {
                                setIconPaths(IconsNext.getPaths(icon, variant));
                            }
                        })
                        .catch(reason => {
                            console.error(`[Blueprint] Next icon '${icon}' (${variant}) could not be loaded.`, reason);
                        });
                } else {
                    console.error(
                        `[Blueprint] Next icon '${icon}' (${variant}) is not loaded yet and autoLoad={false}, ` +
                            `did you call IconsNext.load('${icon}', '${variant}')?`,
                    );
                }
            }
            return () => {
                cancelled = true;
            };
        }, [autoLoad, icon, variant]);

        if (icon == null || typeof icon === "boolean") {
            return null;
        } else if (typeof icon !== "string") {
            return icon;
        }

        if (iconPaths == null) {
            // Render an empty wrapper while loading to avoid layout shift
            return createElement(tagName || "span", {
                "aria-hidden": true,
                className: classNames(Classes.ICON, Classes.iconClass(icon), Classes.intentClass(intent), className),
                "data-icon": icon,
                ref,
                title: htmlTitle,
            });
        }

        const pathElements = iconPaths.map((d, i) => <path d={d} key={i} />);

        return (
            <SvgIconContainerNext<any>
                children={pathElements}
                className={classNames(Classes.intentClass(intent), className)}
                color={color}
                htmlTitle={htmlTitle}
                iconName={icon}
                ref={ref}
                size={size}
                svgProps={svgProps}
                tagName={tagName}
                title={title}
                {...htmlProps}
            />
        );
    },
);
IconNext.displayName = `${DISPLAYNAME_PREFIX}.IconNext`;
