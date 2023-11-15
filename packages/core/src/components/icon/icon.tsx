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

import {
    type DefaultSVGIconProps,
    type IconName,
    type IconPaths,
    Icons,
    IconSize,
    SVGIconContainer,
    type SVGIconProps,
} from "@blueprintjs/icons";

import {
    Classes,
    DISPLAYNAME_PREFIX,
    type IntentProps,
    type MaybeElement,
    type Props,
    removeNonHTMLProps,
} from "../../common";

// re-export for convenience, since some users won't be importing from or have a direct dependency on the icons package
export { type IconName, IconSize };

export interface IconOwnProps {
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

    /**
     * Alias for `size` prop. Kept around for backwards-compatibility with Blueprint v4.x,
     * will be removed in v6.0.
     *
     * @deprecated use `size` prop instead
     */
    iconSize?: number;

    /** Props to apply to the `SVG` element */
    svgProps?: React.HTMLAttributes<SVGElement>;
}

// N.B. the following inteface is defined as a type alias instead of an interface due to a TypeScript limitation
// where interfaces cannot extend conditionally-defined union types.
/**
 * Generic interface for the `<Icon>` component which may be parameterized by its root element type.
 *
 * @see https://blueprintjs.com/docs/#core/components/icon.dom-attributes
 */
export type IconProps<T extends Element = Element> = IntentProps & Props & SVGIconProps<T> & IconOwnProps;

/**
 * The default `<Icon>` props interface, equivalent to `IconProps` with its default type parameter.
 * This is primarly exported for documentation purposes; users should reference `IconProps<T>` instead.
 */
export interface DefaultIconProps extends IntentProps, Props, DefaultSVGIconProps, IconOwnProps {
    // empty interface for documentation purposes (documentalist handles this better than the IconProps<T> type alias)
}

/**
 * Generic icon component type. This is essentially a type hack required to make forwardRef work with generic
 * components. Note that this slows down TypeScript compilation, but it better than the alternative of globally
 * augmenting "@types/react".
 *
 * @see https://stackoverflow.com/a/73795494/7406866
 */
export interface IconComponent extends React.FC<IconProps<Element>> {
    <T extends Element = Element>(props: IconProps<T>): React.ReactElement | null;
}

/**
 * Icon component.
 *
 * @see https://blueprintjs.com/docs/#core/components/icon
 */
// eslint-disable-next-line prefer-arrow-callback
export const Icon: IconComponent = React.forwardRef(function <T extends Element>(
    props: IconProps<T>,
    ref: React.Ref<T>,
) {
    const { autoLoad, className, color, icon, intent, tagName, svgProps, title, htmlTitle, ...htmlProps } = props;

    // Preserve Blueprint v4.x behavior: iconSize prop takes predecence, then size prop, then fall back to default value
    // eslint-disable-next-line deprecation/deprecation
    const size = props.iconSize ?? props.size ?? IconSize.STANDARD;

    const [iconPaths, setIconPaths] = React.useState<IconPaths | undefined>(() =>
        typeof icon === "string" ? Icons.getPaths(icon, size) : undefined,
    );

    React.useEffect(() => {
        let shouldCancelIconLoading = false;
        if (typeof icon === "string") {
            // The icon may have been loaded already, in which case we can simply grab it.
            // N.B. when `autoLoad={true}`, we can't rely on simply calling Icons.load() here to re-load an icon module
            // which has already been loaded & cached, since it may have been loaded with special loading options which
            // this component knows nothing about.
            const loadedIconPaths = Icons.getPaths(icon, size);

            if (loadedIconPaths !== undefined) {
                setIconPaths(loadedIconPaths);
            } else if (autoLoad) {
                Icons.load(icon, size)
                    .then(() => {
                        // if this effect expired by the time icon loaded, then don't set state
                        if (!shouldCancelIconLoading) {
                            setIconPaths(Icons.getPaths(icon, size));
                        }
                    })
                    .catch(reason => {
                        console.error(`[Blueprint] Icon '${icon}' (${size}px) could not be loaded.`, reason);
                    });
            } else {
                console.error(
                    `[Blueprint] Icon '${icon}' (${size}px) is not loaded yet and autoLoad={false}, did you call Icons.load('${icon}', ${size})?`,
                );
            }
        }
        return () => {
            shouldCancelIconLoading = true;
        };
    }, [autoLoad, icon, size]);

    if (icon == null || typeof icon === "boolean") {
        return null;
    } else if (typeof icon !== "string") {
        return icon;
    }

    if (iconPaths == null) {
        // fall back to icon font if unloaded or unable to load SVG implementation
        const sizeClass =
            size === IconSize.STANDARD
                ? Classes.ICON_STANDARD
                : size === IconSize.LARGE
                ? Classes.ICON_LARGE
                : undefined;
        return React.createElement(tagName!, {
            ...removeNonHTMLProps(htmlProps),
            "aria-hidden": title ? undefined : true,
            className: classNames(
                Classes.ICON,
                sizeClass,
                Classes.iconClass(icon),
                Classes.intentClass(intent),
                className,
            ),
            "data-icon": icon,
            ref,
            title: htmlTitle,
        });
    } else {
        const pathElements = iconPaths.map((d, i) => <path d={d} key={i} fillRule="evenodd" />);
        // HACKHACK: there is no good way to narrow the type of SVGIconContainerProps here because of the use
        // of a conditional type within the type union that defines that interface. So we cast to <any>.
        // see https://github.com/microsoft/TypeScript/issues/24929, https://github.com/microsoft/TypeScript/issues/33014
        return (
            <SVGIconContainer<any>
                children={pathElements}
                // don't forward Classes.iconClass(icon) here, since the container will render that class
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
    }
});
Icon.defaultProps = {
    autoLoad: true,
    tagName: "span",
};
Icon.displayName = `${DISPLAYNAME_PREFIX}.Icon`;
