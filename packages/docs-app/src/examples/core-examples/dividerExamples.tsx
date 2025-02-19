/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";
import * as React from "react";

import { Divider } from "@blueprintjs/core";
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

export const DividerBasicExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        Content above
        <Divider />
        Content below`;
    return (
        <CodeExample code={code} {...props}>
            <div>
                Content above
                <Divider />
                Content below
            </div>
        </CodeExample>
    );
};

export const DividerVerticalExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <div style={{ display: "flex" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis aliquam elit. Quisque ultricies
            dolor non sapien dictum semper.
            <Divider />
            Praesent auctor eros vitae lacus porttitor elementum. Curabitur dolor dolor, sodales eget mi eget,
            convallis scelerisque eros.
        </div>`;
    return (
        <CodeExample code={code} {...props}>
            <div style={{ display: "flex" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis aliquam elit. Quisque ultricies
                dolor non sapien dictum semper.
                <Divider />
                Praesent auctor eros vitae lacus porttitor elementum. Curabitur dolor dolor, sodales eget mi eget,
                convallis scelerisque eros.
            </div>
        </CodeExample>
    );
};
