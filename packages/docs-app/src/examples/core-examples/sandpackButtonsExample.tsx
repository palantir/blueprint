/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import {
    SandpackCodeEditor,
    SandpackLayout,
    SandpackPreview,
    SandpackProvider,
    type SandpackTheme,
} from "@codesandbox/sandpack-react";
import * as React from "react";

import { Colors } from "@blueprintjs/core";

const app = `import { Button } from '@blueprintjs/core'

export default function App() {
  return (
    <Button intent="primary">
      Hello World
    </Button>
  );
}`;

const index = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FocusStyleManager } from "@blueprintjs/core";
import "./styles.css";

import App from "./App";
import React from "react";

import "@blueprintjs/core/lib/css/blueprint.css";

FocusStyleManager.onlyShowFocusOnTabs();

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

const styles = `body {
  background-color: #1C2127;
}
`;

const theme: SandpackTheme = {
    colors: {
        accent: Colors.BLUE5,
        base: Colors.GRAY3,
        clickable: Colors.GRAY2,
        disabled: Colors.DARK_GRAY4,
        error: Colors.RED5,
        errorSurface: Colors.RED1,
        hover: Colors.GRAY5,
        surface1: Colors.BLACK,
        surface2: Colors.DARK_GRAY2,
        surface3: Colors.DARK_GRAY5,
    },
    font: {
        body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", blueprint-icons-16, sans-serif',
        lineHeight: "20px",
        mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
        size: "13px",
    },
    syntax: {
        comment: { color: Colors.GRAY2, fontStyle: "italic" },
        definition: Colors.GOLD5,
        keyword: Colors.VIOLET4,
        plain: Colors.GOLD5,
        property: Colors.TURQUOISE3,
        punctuation: Colors.WHITE,
        static: Colors.RED3,
        string: Colors.LIME4,
        tag: Colors.FOREST3,
    },
};

export function SandpackButtonsExample() {
    return (
        <SandpackProvider
            template="react-ts"
            theme={theme}
            options={{ visibleFiles: ["/App.tsx"] }}
            customSetup={{
                dependencies: {
                    "@blueprintjs/core": "^5.13.1",
                },
            }}
            files={{
                "/App.tsx": app,
                "/index.tsx": index,
                "/styles.css": styles,
            }}
        >
            <SandpackLayout className="layout">
                <SandpackCodeEditor className="editor" />
                <SandpackPreview className="preview" />
            </SandpackLayout>
        </SandpackProvider>
    );
}
