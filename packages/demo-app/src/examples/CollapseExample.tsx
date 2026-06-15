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

import { useCallback, useState } from "react";

import { Button, Card, Collapse } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

export const CollapseExample: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);

    return (
        <ExampleCard label="Collapse">
            <Button onClick={handleToggle}>{isOpen ? "Hide" : "Show"}</Button>
            <Collapse isOpen={isOpen}>
                <Card style={{ marginTop: 10 }}>
                    <p>This content starts open and can be toggled.</p>
                </Card>
            </Collapse>
        </ExampleCard>
    );
};

CollapseExample.displayName = "DemoApp.CollapseExample";
