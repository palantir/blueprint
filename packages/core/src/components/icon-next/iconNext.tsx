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
import { cloneElement, forwardRef, isValidElement, useEffect, useState } from "react";

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

import {
    Classes,
    DISPLAYNAME_PREFIX,
    type IntentProps,
    type MaybeElement,
    type Props,
    removeNonHTMLProps,
} from "../../common";
import { isBlueprintIconElement } from "../../common/utils";

interface LoadedIconPaths {
    icon: IconNextName;
    paths: IconPaths;
    variant: NextIconVariant;
}

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
     * - If given a `React.JSX.Element`, that element is cloned with the parent-provided `className` and intent class
     *   merged onto its root. If the element is a Blueprint icon component, DOM attributes and the `color` and
     *   `size` props are also forwarded onto it, with the element's own `color`/`size` taking precedence. For any
     *   other element type, other props on this component are ignored.
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

        const [loadedIconPaths, setLoadedIconPaths] = useState<LoadedIconPaths | undefined>(() => {
            if (typeof icon !== "string") {
                return undefined;
            }
            const paths = IconsNext.getPaths(icon, variant);
            return paths === undefined ? undefined : { icon, paths, variant };
        });

        useEffect(() => {
            let cancelled = false;
            if (typeof icon === "string") {
                const cached = IconsNext.getPaths(icon, variant);

                if (cached !== undefined) {
                    setLoadedIconPaths({ icon, paths: cached, variant });
                } else if (autoLoad) {
                    IconsNext.load(icon, variant)
                        .then(() => {
                            if (!cancelled) {
                                const paths = IconsNext.getPaths(icon, variant);
                                if (paths !== undefined) {
                                    setLoadedIconPaths({ icon, paths, variant });
                                }
                            }
                        })
                        .catch(reason => {
                            if (!cancelled) {
                                console.error(
                                    `[Blueprint] Next icon '${icon}' (${variant}) could not be loaded.`,
                                    reason,
                                );
                            }
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
            if (isValidElement<Pick<SVGIconProps, "className">>(icon)) {
                const mergedClassName = classNames(icon.props.className, className, Classes.intentClass(intent));

                if (isBlueprintIconElement(icon)) {
                    const iconElementProps: SVGIconProps = {
                        ...removeNonHTMLProps(htmlProps),
                        className: mergedClassName,
                    };
                    const resolvedSize = icon.props.size ?? props.size;
                    if (resolvedSize != null) {
                        iconElementProps.size = resolvedSize;
                    }
                    const resolvedColor = icon.props.color ?? color;
                    if (resolvedColor != null) {
                        iconElementProps.color = resolvedColor;
                    }
                    return cloneElement(icon, iconElementProps);
                }

                return cloneElement(icon, { className: mergedClassName });
            }
            return icon;
        }

        const cachedIconPaths = IconsNext.getPaths(icon, variant);
        const iconPaths =
            cachedIconPaths ??
            (loadedIconPaths?.icon === icon && loadedIconPaths.variant === variant ? loadedIconPaths.paths : undefined);
        const pathElements = iconPaths?.map((d, i) => <path d={d} key={i} />) ?? [];

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
                {...removeNonHTMLProps(htmlProps)}
            />
        );
    },
);
IconNext.displayName = `${DISPLAYNAME_PREFIX}.IconNext`;
