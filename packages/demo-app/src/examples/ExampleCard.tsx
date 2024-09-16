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

import * as React from "react";

import { Box, Card, H5 } from "@blueprintjs/core";

export interface ExampleCardProps {
    children: React.ReactNode;
    label: string;
    subLabel?: string;
    width?: number;
    horizontal?: boolean;
}

const DEFAULT_WIDTH = 500;

export class ExampleCard extends React.PureComponent<ExampleCardProps> {
    public render() {
        const { children, horizontal, label, subLabel, width = DEFAULT_WIDTH } = this.props;
        return (
            <div className="example-card-container">
                <H5>{label}</H5>
                {subLabel && (
                    <Box as="p" mb={2} color="gray-1">
                        {subLabel}
                    </Box>
                )}
                <Card className="example-card" elevation={0} style={{ width }}>
                    <Box display="flex" flexDirection={horizontal ? "row" : "column"} gap={2}>
                        {children}
                    </Box>
                </Card>
            </div>
        );
    }
}
