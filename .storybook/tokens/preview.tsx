/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Decorator } from "@storybook/react-vite";
import { addons, useCallback, useEffect, useMemo, useRef } from "storybook/preview-api";

import {
    getActiveTheme,
    normalizeTokenOverrides,
    TOKEN_CONFIG,
    TOKEN_NAMES,
    TOKEN_VALUES_REQUESTED,
    TOKEN_VALUES_UPDATED,
    type TokenName,
    type TokenValues,
    type TokenValuesRequest,
    type TokenValuesUpdate,
} from "./tokens";

type InlineTokenValues = Record<TokenName, { priority: string; value: string }>;
interface PublishFrameIds {
    first?: number;
    second?: number;
}

export const withTokens: Decorator = function WithTokens(Story, { globals, id }) {
    const activeTheme = getActiveTheme(globals.theme);
    const themeTokenOverrides = useMemo(
        () => normalizeTokenOverrides(globals.tokenOverrides),
        [globals.tokenOverrides],
    );
    const tokenOverrides = themeTokenOverrides[activeTheme];
    const initialTokenValues = useRef<InlineTokenValues | undefined>(undefined);
    const publishFrameIds = useRef<PublishFrameIds>({});
    const channel = addons.getChannel();
    const scheduleTokenValuesUpdate = useCallback(() => {
        cancelScheduledPublish(publishFrameIds.current);
        publishFrameIds.current.first = window.requestAnimationFrame(() => {
            publishFrameIds.current.first = undefined;
            publishFrameIds.current.second = window.requestAnimationFrame(() => {
                publishFrameIds.current.second = undefined;
                channel.emit(TOKEN_VALUES_UPDATED, {
                    storyId: id,
                    theme: activeTheme,
                    values: readResolvedTokenValues(),
                } satisfies TokenValuesUpdate);
            });
        });
    }, [activeTheme, channel, id]);

    useEffect(
        function captureInitialTokenValues() {
            const style = document.body.style;
            const values = Object.fromEntries(
                TOKEN_NAMES.map(name => [
                    name,
                    {
                        priority: style.getPropertyPriority(name),
                        value: style.getPropertyValue(name),
                    },
                ]),
            ) as InlineTokenValues;
            initialTokenValues.current = values;

            return () => {
                for (const name of TOKEN_NAMES) {
                    const { value, priority } = values[name];
                    // An empty value removes the inline property.
                    style.setProperty(name, value, priority);
                }
                initialTokenValues.current = undefined;
            };
        },
        [id],
    );

    useEffect(
        function publishTokenValuesOnRequest() {
            const handleRequest = (request: TokenValuesRequest) => {
                if (request.storyId === id && request.theme === activeTheme) {
                    scheduleTokenValuesUpdate();
                }
            };
            channel.on(TOKEN_VALUES_REQUESTED, handleRequest);
            return () => channel.off(TOKEN_VALUES_REQUESTED, handleRequest);
        },
        [activeTheme, channel, id, scheduleTokenValuesUpdate],
    );

    useEffect(function cancelPendingTokenValuesUpdate() {
        const frameIds = publishFrameIds.current;
        return () => cancelScheduledPublish(frameIds);
    }, []);

    useEffect(
        function applyTokenOverrides() {
            const style = document.body.style;
            const overrides = tokenOverrides ?? {};

            for (const name of TOKEN_NAMES) {
                const override = overrides[name];
                if (override != null && override !== "") {
                    style.setProperty(name, override);
                } else {
                    const initialValue = initialTokenValues.current?.[name];
                    style.setProperty(name, initialValue?.value ?? "", initialValue?.priority);
                }
            }

            scheduleTokenValuesUpdate();
        },
        [id, scheduleTokenValuesUpdate, tokenOverrides],
    );

    return <Story />;
};

function readResolvedTokenValues(): TokenValues {
    const bodyStyle = window.getComputedStyle(document.body);
    const colorProbe = document.createElement("span");
    colorProbe.setAttribute("aria-hidden", "true");
    Object.assign(colorProbe.style, {
        pointerEvents: "none",
        position: "fixed",
        visibility: "hidden",
    });
    document.body.appendChild(colorProbe);

    const canvas = document.createElement("canvas");
    canvas.height = 1;
    canvas.width = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    try {
        return Object.fromEntries(
            TOKEN_NAMES.map(name => {
                const editor = TOKEN_CONFIG[name];
                const value =
                    editor.type === "color"
                        ? readColorTokenValue(name, colorProbe, context)
                        : bodyStyle.getPropertyValue(name).trim();
                return [name, value || editor.defaultCssValue || ""];
            }),
        ) as TokenValues;
    } finally {
        colorProbe.remove();
    }
}

function readColorTokenValue(
    name: TokenName,
    colorProbe: HTMLSpanElement,
    context: CanvasRenderingContext2D | null,
): string {
    colorProbe.style.color = "";
    colorProbe.style.color = `var(${name})`;
    const color = window.getComputedStyle(colorProbe).color;
    if (context === null) {
        return color;
    }

    context.clearRect(0, 0, 1, 1);
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
    const channels = [red, green, blue, ...(alpha === 255 ? [] : [alpha])];
    return `#${channels.map(toHexChannel).join("")}`;
}

function toHexChannel(channel: number): string {
    return channel.toString(16).padStart(2, "0");
}

function cancelScheduledPublish(frameIds: PublishFrameIds): void {
    if (frameIds.first !== undefined) {
        window.cancelAnimationFrame(frameIds.first);
        frameIds.first = undefined;
    }
    if (frameIds.second !== undefined) {
        window.cancelAnimationFrame(frameIds.second);
        frameIds.second = undefined;
    }
}
