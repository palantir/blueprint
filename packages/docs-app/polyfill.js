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

/**
 * Require the minimal set of ES2015+ polyfills from `core-js`, `promise`, and `whatwg-fetch` to run in IE11+.
 * Adapted from the "react-app-polyfill" package.
 * See "NPM Installation" section of docs homepage for more information.
 */

if (typeof Promise === "undefined") {
    // Rejection tracking prevents a common issue where React gets into an
    // inconsistent state due to an error, but it gets swallowed by a Promise,
    // and the user has no idea what causes React's erratic future behavior.
    require("promise/lib/rejection-tracking").enable();
    self.Promise = require("promise/lib/es6-extensions.js");
}

// Make sure we're in a Browser-like environment before importing polyfills
// This prevents `fetch()` from being imported in a Node test environment
if (typeof window !== "undefined") {
    // fetch() polyfill for making API calls.
    require("whatwg-fetch");
}

// Object.assign() is commonly used with React.
require("core-js/features/object/assign");
// Support for...of (a commonly used syntax feature that requires Symbols)
require("core-js/features/symbol");
// Support iterable spread (...Set, ...Map)
require("core-js/features/array/from");
// Support Array(...).fill(), used by popper.js
require("core-js/features/array/fill");
// Support [...].find()
require("core-js/features/array/find");
// Support Map()
require("core-js/features/map");
// Support Set()
require("core-js/features/set");
// Support "string".startsWith()
require("core-js/features/string/starts-with");
// Support Object.values()
require("core-js/proposals/object-values-entries");
