/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable import/no-default-export */

declare module "*.mdx" {
    import type { ComponentType } from "react";
    const MDXComponent: ComponentType;
    export default MDXComponent;
}
