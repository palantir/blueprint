/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { isNodeEnv } from "../common/utils";

/**
 * Custom hook for validating component props during development.
 * This hook runs validation checks only in non-production environments,
 * following the same pattern as AbstractComponent.
 *
 * @param validator - Function that performs the validation checks
 * @param dependencies - Optional array of dependencies that trigger validation when changed
 *
 * @example
 * useValidateProps(() => {
 *     if (value < 0) console.warn("Value must be positive");
 * }, [value]);
 */
export function useValidateProps(validator: () => void, dependencies: React.DependencyList = []) {
    React.useEffect(() => {
        if (!isNodeEnv("production")) {
            validator();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}
