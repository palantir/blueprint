/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { Classes } from "@blueprintjs/core";

const CORE_NS = Classes.getClassNamespace();

const NS = `${CORE_NS}-labs`;

/**
 * Returns the namespace prefix for all Blueprint CSS classes.
 * Customize this namespace at build time by defining it with `webpack.DefinePlugin`.
 */
export function getClassNamespace() {
    return NS;
}

export const BOX = `${NS}-box`;
