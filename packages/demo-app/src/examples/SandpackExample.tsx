/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { Sandpack } from "@codesandbox/sandpack-react";
import * as React from "react";

const app = `import { Button } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";

export default function App() {
    return <Button intent="primary">Hello Sandpack</Button>;
}`;

const dependencies = {
    "@blueprintjs/core": "^5.16.1",
};

export const SandpackExample = () => {
    return <Sandpack template="react-ts" files={{ "/App.tsx": app }} customSetup={{ dependencies }} />;
};
