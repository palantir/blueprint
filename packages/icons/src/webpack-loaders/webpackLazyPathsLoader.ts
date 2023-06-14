/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { IconPathsLoader } from "../iconLoader";
import { IconSize } from "../iconTypes";

/**
 * A "lazy" webpack module loader.
 *
 * @see https://webpack.js.org/api/module-methods/#magic-comments for dynamic import() reference
 */
export const webpackLazyPathsLoader: IconPathsLoader = async (name, size) => {
    return (
        size === IconSize.STANDARD
            ? await import(
                  /* webpackChunkName: "blueprint-icons-16px" */
                  /* webpackInclude: /\.js$/ */
                  /* webpackMode: "lazy" */
                  `../generated/16px/paths/${name}`
              )
            : await import(
                  /* webpackChunkName: "blueprint-icons-20px" */
                  /* webpackInclude: /\.js$/ */
                  /* webpackMode: "lazy" */
                  `../generated/20px/paths/${name}`
              )
    ).default;
};
