/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

// injected by webpack.DefinePlugin
declare let BLUEPRINT_NAMESPACE: string | undefined;
declare let REACT_APP_BLUEPRINT_NAMESPACE: string | undefined;
let NS = "bp6";

if (typeof BLUEPRINT_NAMESPACE !== "undefined") {
    NS = BLUEPRINT_NAMESPACE;
} else if (typeof REACT_APP_BLUEPRINT_NAMESPACE !== "undefined") {
    NS = REACT_APP_BLUEPRINT_NAMESPACE;
}
export const SAMPLE_COMPONENT = `${NS}-sample-component`;
