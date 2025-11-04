/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { forwardRef } from "react";

import { DISPLAYNAME_PREFIX as CORE_DISPLAYNAME_PREFIX } from "@blueprintjs/core";

import { Box } from "../box/box";
import type { BoxProps } from "../box/boxProps";

export type FlexProps = Omit<BoxProps, "display">;

/**
 * Flex component.
 */
export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(props, ref) {
    return <Box {...props} display="flex" ref={ref} />;
});

Flex.displayName = `${CORE_DISPLAYNAME_PREFIX}.Flex`;
