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

import { Button, Code, H5, Section, SectionCard } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { Flex, Layer, Surface } from "@blueprintjs/labs";

export const SurfaceLayerCompositionExample: React.FC<ExampleProps> = props => {
    return (
        <Example {...props}>
            <Surface asChild={true} shadow={3}>
                <Section style={{ maxWidth: 320 }} title="Composed surface">
                    <Layer asChild={true} intent="primary" index={1}>
                        <SectionCard>
                            <Flex flexDirection="column" gap={3}>
                                <H5>Surface + Layer</H5>
                                <span>
                                    The <Code>&lt;Section&gt;</Code> is the base and the{" "}
                                    <Code>&lt;SectionCard&gt;</Code> is the <Code>primary</Code>{" "}
                                    wash — both applied via <Code>asChild</Code>, adding no extra
                                    DOM nodes.
                                </span>
                                <Button intent="primary" text="Action" />
                            </Flex>
                        </SectionCard>
                    </Layer>
                </Section>
            </Surface>
        </Example>
    );
};
