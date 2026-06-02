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

import { Button, Code, H5, Section } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { Flex, Surface } from "@blueprintjs/labs";

export const SurfaceAsChildExample: React.FC<ExampleProps> = props => {
    return (
        <Example {...props}>
            {/* `asChild` merges the surface classes onto the <section> below — no extra wrapper node. */}
            <Surface asChild={true} intent="primary" shadow={3}>
                <Section style={{ maxWidth: 320, padding: 24 }}>
                    <Flex flexDirection="column" gap={3}>
                        <H5 style={{ margin: 0 }}>Composed surface</H5>
                        <span>
                            <Code>asChild</Code> applies the surface styling directly to this{" "}
                            <Code>&lt;section&gt;</Code> instead of rendering an extra{" "}
                            <Code>&lt;div&gt;</Code>.
                        </span>
                        <Button intent="primary" text="Action" />
                    </Flex>
                </Section>
            </Surface>
        </Example>
    );
};
