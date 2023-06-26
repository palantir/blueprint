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

/**
 * Represents anything that has a `name` property such as Functions.
 */
export interface Named {
    name?: string;
}

/**
 * Generic interface defining constructor types, such as classes. This is used to type the class
 * itself in meta-programming situations such as decorators.
 */
export type Constructor<T> = new (...args: any[]) => T;

export function getDisplayName(ComponentClass: React.ComponentType | Named) {
    return (ComponentClass as React.ComponentType).displayName || (ComponentClass as Named).name || "Unknown";
}
