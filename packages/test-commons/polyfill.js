/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

// Note: using CommonJS syntax here so this can be used in the isomorphic tests, which must run in a server environment.

/**
 * Require the minimal set of ES2015+ polyfills from `core-js` library.
 * See "NPM Installation" section of docs homepage for more information.
 */
require("core-js/fn/array/fill");
require("core-js/fn/array/from");
require("core-js/fn/map");
require("core-js/fn/set");
