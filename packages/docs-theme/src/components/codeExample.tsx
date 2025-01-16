/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import classNames from "classnames";
import * as React from "react";

export interface CodeExampleProps {
    children?: React.ReactNode;
    className?: string;
    code: string;
    id: string;
}

export const CodeExample: React.FC<CodeExampleProps> = props => {
    const { children, className, code, id, ...rest } = props;
    const classes = classNames("docs-code-example-frame", className);

    return (
        <div className={classes} data-example-id={id} {...rest}>
            <SandpackProvider
                template="react-ts"
                options={{ visibleFiles: ["/App.tsx"] }}
                customSetup={{
                    dependencies: {
                        "@blueprintjs/core": "^5.13.1",
                    },
                }}
                files={{
                    "/App.tsx": code,
                    "/index.tsx": index,
                }}
            >
                <SandpackLayout className="layout">
                    <SandpackCodeEditor className="editor" />
                    <SandpackPreview className="preview" />
                </SandpackLayout>
            </SandpackProvider>
        </div>
    );
};

const index = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FocusStyleManager } from "@blueprintjs/core";
import App from "./App";
import React from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
FocusStyleManager.onlyShowFocusOnTabs();
const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
`;
