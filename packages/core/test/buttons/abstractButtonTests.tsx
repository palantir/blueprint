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

import { shallow } from "enzyme";
import * as React from "react";

import { Alignment, AnchorButton, Button } from "../../src";

describe("ButtonProps", () => {
    describe("(omitting 'ref' prop) should be assignable to", () => {
        const buttonProps = {
            active: true,
            alignText: Alignment.LEFT,
            fill: true,
            onClick: (_event: React.MouseEvent<HTMLElement>) => {
                /* no-op */
            },
            outlined: true,
        };

        it("<Button> component", () => {
            shallow(<Button {...buttonProps} />);
        });

        it("<AnchorButton> component", () => {
            shallow(<AnchorButton {...buttonProps} />);
        });
    });
});
