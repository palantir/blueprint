/* !
* (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
*/

declare module "*.mdx" {
    import type { ComponentType } from "react";
    const Component: ComponentType;
    export default Component;
}
