/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import MenuBasic from "./menu/MenuBasic";
import menuBasicPreview from "./menu/MenuBasic.tsx.preview?raw";
import menuBasicCode from "./menu/MenuBasic.tsx?raw";
import MenuSubmenu from "./menu/MenuSubmenu";
import menuSubmenuPreview from "./menu/MenuSubmenu.tsx.preview?raw";
import menuSubmenuCode from "./menu/MenuSubmenu.tsx?raw";

export const MenuBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={menuBasicPreview} sourceCode={menuBasicCode} {...props}>
            <MenuBasic />
        </CodeExample>
    );
};

export const MenuSubmenuExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample previewCode={menuSubmenuPreview} sourceCode={menuSubmenuCode} {...props}>
            <MenuSubmenu />
        </CodeExample>
    );
};
