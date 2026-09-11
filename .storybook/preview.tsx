/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook runs from the root dev dependencies.
import { type ReactNode, useState } from "react";

import { BlueprintProvider, Classes, Colors, FocusStyleManager } from "@blueprintjs/core";

import { Icons } from "../packages/icons/src/iconLoader";

import { modes } from "./modes";

FocusStyleManager.onlyShowFocusOnTabs();

Icons.setLoaderOptions({ loader: "all" });

// optionally, load the icons up-front so that future usage does not trigger a network request
await Icons.loadAll();

interface BlueprintStoryProps {
    children: ReactNode;
    isDark: boolean;
    useNextStyles: boolean;
}

function BlueprintStory({ children, isDark, useNextStyles }: BlueprintStoryProps) {
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
    const className = [isDark ? Classes.DARK : undefined, useNextStyles ? "bp-next" : undefined]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={className} data-bp-color-scheme={isDark ? "dark" : "light"} ref={setPortalContainer}>
            {portalContainer != null && (
                <BlueprintProvider portalContainer={portalContainer}>{children}</BlueprintProvider>
            )}
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
            const useNextStyles = blueprintStyles === "next" || context.title.startsWith("NextStyles/");
            if (typeof document !== "undefined" && document.body) {
                // Setting dark background based on class
                document.body.style.backgroundColor = isDark ? Colors.BLACK : Colors.WHITE;
            }
            return (
                <BlueprintStory isDark={isDark} useNextStyles={useNextStyles}>
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
