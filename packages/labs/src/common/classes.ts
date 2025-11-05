/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { Classes } from "@blueprintjs/core";

const CORE_NS = Classes.getClassNamespace();

// injected by webpack.DefinePlugin
declare let BLUEPRINT_NAMESPACE: string | undefined;
declare let REACT_APP_BLUEPRINT_NAMESPACE: string | undefined;

let NS = `${CORE_NS}-labs`;

if (typeof BLUEPRINT_NAMESPACE !== "undefined") {
    NS = BLUEPRINT_NAMESPACE;
} else if (typeof REACT_APP_BLUEPRINT_NAMESPACE !== "undefined") {
    NS = REACT_APP_BLUEPRINT_NAMESPACE;
}

/**
 * Returns the namespace prefix for all Blueprint CSS classes.
 * Customize this namespace at build time by defining it with `webpack.DefinePlugin`.
 */
export function getClassNamespace() {
    return NS;
}

export const BOX = `${NS}-box`;
