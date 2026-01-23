/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable import/no-default-export */

// Type definition for importing MDX files as React components
declare module "*.mdx" {
    import type { ComponentType } from "react";

    const MDXComponent: ComponentType;
    export default MDXComponent;
}
