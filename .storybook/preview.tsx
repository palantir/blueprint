/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import { type CSSProperties, type ReactNode, useState } from "react";

import { BlueprintProvider, Classes, Colors, FocusStyleManager } from "@blueprintjs/core";

import { Icons } from "../packages/icons/src/iconLoader";

import { modes } from "./modes";

FocusStyleManager.onlyShowFocusOnTabs();

Icons.setLoaderOptions({ loader: "all" });

// optionally, load the icons up-front so that future usage does not trigger a network request
await Icons.loadAll();

const customPrimaryIntentStyle = {
    "--bp-intent-primary-100": "var(--bp-palette-turquoise-100)",
    "--bp-intent-primary-200": "var(--bp-palette-turquoise-200)",
    "--bp-intent-primary-300": "var(--bp-palette-turquoise-300)",
    "--bp-intent-primary-400": "var(--bp-palette-turquoise-400)",
    "--bp-intent-primary-500": "var(--bp-palette-turquoise-500)",
    "--bp-intent-primary-600": "var(--bp-palette-turquoise-600)",
    "--bp-intent-primary-700": "var(--bp-palette-turquoise-700)",
    "--bp-intent-primary-800": "var(--bp-palette-turquoise-800)",
    "--bp-intent-primary-900": "var(--bp-palette-turquoise-900)",
    "--bp-intent-primary-1000": "var(--bp-palette-turquoise-1000)",
} as CSSProperties;

interface BlueprintStoryProps {
    children: ReactNode;
    isDark: boolean;
    useCustomIntent: boolean;
    useNextStyles: boolean;
}

function BlueprintStory({ children, isDark, useCustomIntent, useNextStyles }: BlueprintStoryProps) {
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
    const className = [isDark ? Classes.DARK : undefined, useNextStyles ? "bp-next" : undefined]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={className}
            data-bp-color-scheme={isDark ? "dark" : "light"}
            ref={setPortalContainer}
            style={useCustomIntent ? customPrimaryIntentStyle : undefined}
        >
            <BlueprintProvider portalContainer={portalContainer ?? undefined}>{children}</BlueprintProvider>
        </div>
    );
}

// Import Blueprint compiled CSS
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/labs/lib/css/blueprint-labs.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/table/lib/css/table.css";

const preview: Preview = {
    parameters: {
        backgrounds: { disable: true },
        chromatic: {
            modes: {
                dark: modes.dark,
                light: modes.light,
                nextDark: modes.nextDark,
                nextLight: modes.nextLight,
                nextCustomIntent: modes.nextCustomIntent,
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            codePanel: true,
        },
        layout: "centered",
    },

    decorators: [
        withThemeByClassName({
            defaultTheme: "light",
            parentSelector: "body",
            themes: {
                dark: Classes.DARK,
                light: "",
            },
        }),
        (Story, context) => {
            const isDark = context.globals?.theme === "dark";
            const blueprintStyles = context.globals?.blueprintStyles;
            const useCustomIntent = blueprintStyles === "next-custom-intent";
            const useNextStyles =
                blueprintStyles === "next" || useCustomIntent || context.title.startsWith("NextStyles/");
            if (typeof document !== "undefined" && document.body) {
                // Setting dark background based on class
                document.body.style.backgroundColor = isDark ? Colors.BLACK : Colors.WHITE;
            }
            return (
                <BlueprintStory isDark={isDark} useCustomIntent={useCustomIntent} useNextStyles={useNextStyles}>
                    <Story />
                </BlueprintStory>
            );
        },
    ],

    globalTypes: {
        blueprintStyles: {
            description: "Blueprint component style generation",
            toolbar: {
                icon: "paintbrush",
                items: [
                    { title: "BP6", value: "bp6" },
                    { title: "BP7", value: "next" },
                    { title: "BP7 custom intent", value: "next-custom-intent" },
                ],
            },
        },
    },

    initialGlobals: {
        blueprintStyles: "bp6",
        theme: "light",
    },
};

// eslint-disable-next-line import/no-default-export
export default preview;
