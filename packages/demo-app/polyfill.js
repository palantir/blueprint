/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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
