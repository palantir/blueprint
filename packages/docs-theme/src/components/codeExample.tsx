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

export const CodeExample: React.FC<CodeExampleProps> = props => {
    const { children, className, code, id, ...rest } = props;
    const classes = classNames("docs-code-example-frame", className);

    return (
        <div className={classes} data-example-id={id} {...rest}>
            <Sandpack />
        </div>
    );
};
