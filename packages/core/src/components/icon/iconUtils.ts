/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { IconName, IconSvgPaths16 } from "@blueprintjs/icons";

export function iconNameToPathsRecordKey(name: IconName): keyof (typeof IconSvgPaths16) {
    return kebabCaseToCamelCase(name);
}

function kebabCaseToCamelCase<S extends string>(
    snakeCaseString: S,
): KebabCaseToCamelCase<S> {
    return (
        snakeCaseString
        .split("_")
        .map((word, i) =>
            i === 0 ?
                word.toLowerCase() :
                word && (word[0].toUpperCase() + word.slice(1).toLowerCase())
        )
        .join("")
    ) as KebabCaseToCamelCase<S>
}

type KebabCaseToCamelCase<S extends string> =
    S extends `${infer FirstWord}-${infer Rest}` ?
        `${Lowercase<FirstWord>}${KebabCaseToPascalCase<Rest>}` :
        `${Lowercase<S>}`;

type KebabCaseToPascalCase<S extends string> =
    S extends `${infer FirstWord}-${infer Rest}` ?
        `${Capitalize<Lowercase<FirstWord>>}${KebabCaseToPascalCase<Rest>}` :
        Capitalize<Lowercase<S>>;
