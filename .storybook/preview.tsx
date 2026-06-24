/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

import { BlueprintProvider, Classes, Colors, FocusStyleManager } from "@blueprintjs/core";

import { Icons } from "../packages/icons/src/iconLoader";

import { modes } from "./modes";

FocusStyleManager.onlyShowFocusOnTabs();

Icons.setLoaderOptions({ loader: "all" });

// optionally, load the icons up-front so that future usage does not trigger a network request
await Icons.loadAll();

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
            if (typeof document !== "undefined" && document.body) {
                // Setting dark background based on class
                document.body.style.backgroundColor = isDark ? Colors.BLACK : Colors.WHITE;
            }
            return (
                <BlueprintProvider>
                    <Story />
                </BlueprintProvider>
            );
        },
    ],

    initialGlobals: {
        theme: "light",
    },
};

// eslint-disable-next-line import/no-default-export
export default preview;
