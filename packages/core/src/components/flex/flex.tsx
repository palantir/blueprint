/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { DISPLAYNAME_PREFIX } from "../../common";
import { Box } from "../box/box";
import type { BoxProps } from "../box/boxProps";

export type FlexProps = Omit<BoxProps, "display">;

export const Flex = (props: FlexProps) => <Box {...props} display="flex" />;

Flex.displayName = `${DISPLAYNAME_PREFIX}.Flex`;
