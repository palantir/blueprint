/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

import { BlueprintProvider, Classes, FocusStyleManager } from "@blueprintjs/core";

import { Icons } from "../packages/icons/src/iconLoader";

import { modes } from "./modes";
import { withTokens } from "./tokens/preview";
import { STORYBOOK_BACKGROUNDS } from "./tokens/tokens";

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
        withTokens,
        withThemeByClassName({
            defaultTheme: "light",
            parentSelector: "body",
            themes: {
                dark: Classes.DARK,
                light: "",
            },
        }),
        (Story, context) => {
            const theme = context.globals?.theme === "dark" ? "dark" : "light";
            if (typeof document !== "undefined" && document.body) {
                document.body.style.backgroundColor = STORYBOOK_BACKGROUNDS[theme];
            }
            return (
                <BlueprintProvider>
                    <Story />
                </BlueprintProvider>
            );
        },
    ],

    initialGlobals: {
        simpleColors: {},
        simpleGenerationMode: "js",
        theme: "light",
        tokenOverrides: {},
    },
};

// eslint-disable-next-line import/no-default-export
export default preview;
