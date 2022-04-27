/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License";
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
import "core-js/features/object/assign";
// Support for...of (a commonly used syntax feature that requires Symbols)
import "core-js/features/symbol";
// Support iterable spread (...Set, ...Map)
import "core-js/features/array/from";
// Support Array(...).fill(), used by popper.js
import "core-js/features/array/fill";
// Support [...].find()
import "core-js/features/array/find";
// Support Map()
import "core-js/features/map";
// Support Set()
import "core-js/features/set";
// Support "string".startsWith()
import "core-js/features/string/starts-with";
// Support Object.values()
import "core-js/proposals/object-values-entries";
