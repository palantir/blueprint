/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import type * as React from "react";

import { DISPLAYNAME_PREFIX as CORE_DISPLAYNAME_PREFIX } from "@blueprintjs/core";

export const DISPLAYNAME_PREFIX = `${CORE_DISPLAYNAME_PREFIX}Labs`;

/**
 * A `React.CSSProperties` value that additionally permits CSS custom properties (`--*`).
 *
 * `React.CSSProperties` deliberately omits an index signature for closed typing, so assigning
 * CSS variables in an inline `style` object is otherwise a type error. This widens only the
 * custom-property keys, leaving the standard CSS properties fully type-checked.
 */
export type CSSPropertiesWithVars = React.CSSProperties & Record<`--${string}`, string | number>;
