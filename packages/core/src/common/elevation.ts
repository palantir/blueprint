/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

// tslint:disable:object-literal-sort-keys
export const Elevation = {
    ZERO: 0 as 0,
    ONE: 1 as 1,
    TWO: 2 as 2,
    THREE: 3 as 3,
    FOUR: 4 as 4,
};
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Elevation = typeof Elevation[keyof typeof Elevation];
