/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import * as React from "react";

import { Pre } from "@blueprintjs/core";

import { DOCS_CODE_BLOCK } from "../common/classes";

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
            <div className="docs-code-example">{children}</div>
            <Pre className={DOCS_CODE_BLOCK} data-lang="typescript">
                {code}
            </Pre>
        </div>
    );
};
