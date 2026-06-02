/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { Code } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { Flex, type Shadow, Surface } from "@blueprintjs/labs";

const SHADOW_LEVELS: Shadow[] = [0, 1, 2, 3, 4];

export const SurfaceShadowExample: React.FC<ExampleProps> = props => {
    return (
        <Example {...props}>
            <Flex alignItems="center" gap={6} justifyContent="center" flexWrap="wrap" width="100">
                {SHADOW_LEVELS.map(shadow => (
                    <Surface
                        key={shadow}
                        shadow={shadow}
                        style={{ minWidth: 80, padding: 20, textAlign: "center" }}
                    >
                        <Code>{shadow}</Code>
                    </Surface>
                ))}
            </Flex>
        </Example>
    );
};
