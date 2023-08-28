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

const uniqueCountForNamespace = new Map<string, number>();
/** Generate a unique ID within a given namespace, using a simple counter-based implementation to avoid collisions. */
export function uniqueId(namespace: string) {
    const curCount = uniqueCountForNamespace.get(namespace) ?? 0;
    uniqueCountForNamespace.set(namespace, curCount + 1);
    return `${namespace}-${curCount}`;
}
