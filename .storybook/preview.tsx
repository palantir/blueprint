/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Preview } from "@storybook/react-vite";

import { BlueprintProvider, Classes, Colors, FocusStyleManager } from "@blueprintjs/core";

import { Icons } from "../packages/icons/src/iconLoader";

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

// Note: Icons CSS is not imported globally to avoid dependency optimization issues.
// Stories that need icon styling can import "@blueprintjs/icons/lib/css/blueprint-icons.css".

const preview: Preview = {
    parameters: {
        backgrounds: {
            options: {
                light: {
                    name: "light",
                    value: "#ffffff",
                },

                dark: {
                    name: "dark",
                    value: Colors.BLACK,
                },
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },

    decorators: [
        (Story, context) => {
            // Toggle Blueprint dark mode via the Backgrounds toolbar (light / dark).
            const bg = context.globals?.backgrounds;
            const isDark = bg?.value === Colors.BLACK || bg?.value === "dark" || bg?.name === "dark";
            if (typeof document !== "undefined" && document.body) {
                if (isDark) {
                    document.body.classList.add(Classes.DARK);
                } else {
                    document.body.classList.remove(Classes.DARK);
                }
            }
            return (
                <BlueprintProvider>
                    <Story />
                </BlueprintProvider>
            );
        },
    ],

    initialGlobals: {
        backgrounds: {
            value: "light",
        },
    },
};

// eslint-disable-next-line import/no-default-export
export default preview;
