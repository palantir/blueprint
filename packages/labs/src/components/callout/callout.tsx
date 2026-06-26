/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { forwardRef } from "react";

import { H5, Icon, Intent, type IntentProps, type MaybeElement, type Props, Utils } from "@blueprintjs/core";
import { Error, type IconName, InfoSign, type SVGIconProps, Tick, WarningSign } from "@blueprintjs/icons";

import { Classes, type CSSPropertiesWithVars, DISPLAYNAME_PREFIX } from "../../common";

/** This component also supports the full range of HTML `<div>` attributes. */
export interface CalloutProps
    extends IntentProps,
        Props,
        Omit<React.HTMLAttributes<HTMLDivElement>, keyof IntentProps> {
    /** Callout contents. */
    children?: React.ReactNode;

    /**
     * Whether to use a compact appearance, which reduces the visual padding around callout content.
     *
     * @default false
     */
    compact?: boolean;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render on the left side.
     *
     * If this prop is omitted or `undefined`, the `intent` prop will determine a default icon.
     * If this prop is explicitly `null`, no icon will be displayed (regardless of `intent`).
     */
    icon?: IconName | MaybeElement;

    /**
     * Visual intent color to apply to the background, title, and icon.
     *
     * Defining this prop also applies a default icon, if the `icon` prop is omitted.
     */
    intent?: Intent;

    /**
     * Whether the callout should have a minimal appearance: a subtle tinted background and
     * intent-colored text, rather than the solid filled background used by default.
     *
     * @default false
     */
    minimal?: boolean;

    /**
     * String content of an optional title element.
     *
     * To provide JSX content, pass an `<H5>` element as the first child instead of using this prop.
     */
    title?: string;
}

/**
 * Callout component.
 *
 * A Blueprint 7 styled callout. Unlike the core `@blueprintjs/core` `Callout`, the default
 * appearance is a solid, intent-filled surface; `minimal` switches to a subtle tinted background.
 *
 * The appearance is driven entirely by CSS custom properties resolved from props, so the
 * element only ever carries a single `callout` class regardless of intent, density, or
 * minimal state.
 *
 * @see https://blueprintjs.com/docs/#labs/components/callout
 */
export const Callout = forwardRef<HTMLDivElement, CalloutProps>(function Callout(props, ref) {
    const { className, children, icon, intent, minimal = false, compact = false, style, title, ...htmlProps } = props;
    const iconElement = renderIcon(icon, intent);
    const hasBodyContent = !Utils.isReactNodeEmpty(children);

    // The token "slug" selects which "next" design-token family drives the colors. The absence
    // of an intent maps to the `neutral` family; the four intents map to their own tokens.
    const slug = intent != null && intent !== Intent.NONE ? intent : "neutral";

    const calloutStyle: CSSPropertiesWithVars = {
        ...style,
        // Two background layers composite to form the fill:
        //   - background-color: the opaque base.
        //   - background-image: an optional translucent intent tint. The stylesheet stacks this
        //     `--callout-layer` value several times (the `surface-layer-*` tokens are authored as
        //     `linear-gradient(color 0 0)` "stackable layers" for exactly this purpose) to deepen
        //     the faint ~3% rest tint into the visible minimal fill shown in the design.
        //
        // Minimal: a neutral base with the intent tint stacked on top, plus neutral body text.
        // Solid: the opaque intent color with no tint and white text. In Blueprint 7 the on-intent
        // text color is uniformly white.
        //
        // The solid fill uses the raw `intent.{slug}` color rather than
        // `surface-background-color-{slug}-rest`: for the four intents those are aliases, but the
        // `neutral` surface token resolves to white (a neutral interactive surface, not a fill),
        // which would render white-on-white. `intent.neutral` is the gray the design calls for.
        "--callout-background-color": minimal
            ? "var(--bp-surface-background-color-base-rest)"
            : `var(--bp-intent-${slug})`,
        "--callout-color": minimal ? "var(--bp-typography-color-base)" : "var(--bp-palette-white-1000)",
        "--callout-layer": minimal ? `var(--bp-surface-layer-${slug}-rest)` : "none",
        "--callout-padding": compact ? "calc(var(--bp-surface-spacing) * 2)" : "calc(var(--bp-surface-spacing) * 4)",
    };

    return (
        <div
            className={classNames(Classes.CALLOUT, className)}
            data-has-icon={iconElement != null || undefined}
            data-has-body-content={hasBodyContent || undefined}
            ref={ref}
            style={calloutStyle}
            {...htmlProps}
        >
            {iconElement}
            {title && <H5>{title}</H5>}
            {children}
        </div>
    );
});

Callout.displayName = `${DISPLAYNAME_PREFIX}.Callout`;

const renderIcon = (icon?: CalloutProps["icon"], intent?: Intent): IconName | MaybeElement => {
    // 1. no icon
    if (icon === null || icon === false) {
        return undefined;
    }

    const iconProps = {
        "aria-hidden": true,
        tabIndex: -1,
    } satisfies SVGIconProps;

    // 2. icon specified by name or as a custom SVG element
    if (icon !== undefined) {
        return <Icon icon={icon} {...iconProps} />;
    }

    // 3. icon specified by intent prop
    switch (intent) {
        case Intent.DANGER:
            return <Error {...iconProps} />;
        case Intent.PRIMARY:
            return <InfoSign {...iconProps} />;
        case Intent.WARNING:
            return <WarningSign {...iconProps} />;
        case Intent.SUCCESS:
            return <Tick {...iconProps} />;
        default:
            return undefined;
    }
};
