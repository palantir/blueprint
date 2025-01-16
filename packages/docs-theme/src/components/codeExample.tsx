/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { Sandpack } from "@codesandbox/sandpack-react";
import classNames from "classnames";
import * as React from "react";

export interface CodeExampleProps {
    children?: React.ReactNode;
    className?: string;
    code: string;
    id: string;
}

const app = `import { Button } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";

export default function App() {
    return <Button intent="primary">Hello Sandpack</Button>;
}`;

const dependencies = {
    "@blueprintjs/core": "^5.16.1",
};

export const CodeExample: React.FC<CodeExampleProps> = props => {
    const { children, className, code, id, ...rest } = props;
    const classes = classNames("docs-code-example-frame", className);

    return (
        <div className={classes} data-example-id={id} {...rest}>
            <Sandpack template="react-ts" files={{ "/App.tsx": app }} customSetup={{ dependencies }} />;
        </div>
    );
};
