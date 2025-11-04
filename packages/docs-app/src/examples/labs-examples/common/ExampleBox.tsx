/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { Colors } from "@blueprintjs/core";
import { Flex } from "@blueprintjs/labs";

export interface ExampleBoxProps {
    children?: React.ReactNode;
    color?: string;
    size?: number;
}

export function ExampleBox({ size = 32, children, color = Colors.BLUE3 }: ExampleBoxProps) {
    return (
        <Flex
            alignItems="center"
            justifyContent="center"
            style={{
                backgroundColor: color + "1A",
                borderColor: color,
                borderRadius: 2,
                borderStyle: "solid",
                borderWidth: 1,
                color,
                minHeight: size,
                minWidth: size,
            }}
        >
            {children}
        </Flex>
    );
}
