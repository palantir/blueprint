/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { BlueprintDoczTheme } from "./theme/theme";

// Docz requires the theme to be the default export.
// tslint:disable-next-line:no-default-export
export default BlueprintDoczTheme;

// Named exports for use by consumers.
export * from "./config";
export * from "./theme/wrapper";
export * from "./theme/common";
export * from "./theme/components/banner";
export * from "./theme/components/documentation";
export * from "./theme/components/sidebar/navButton";
export * from "./theme/components/sidebar/navMenuItem";
export * from "./theme/tags";
