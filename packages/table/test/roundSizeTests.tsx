/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { expect } from "chai";
import * as React from "react";
import * as Classes from "../src/common/classes";
import { RoundSize } from "../src/common/roundSize";
import { ReactHarness } from "./harness";

describe("RoundSize", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("displays regular content", () => {
        const rounded = harness.mount(
            <RoundSize>
                <div className="inner" style={{ height: "20px", width: "30px" }}>
                    ...
                </div>
            </RoundSize>,
        );
        const inner = rounded.find(".inner").bounds();
        expect(inner.width).to.equal(30);

        const outer = rounded.find(`.${Classes.TABLE_ROUNDED_LAYOUT}`).bounds();
        expect(outer.width).to.equal(30);
    });

    it("rounds irregular content", () => {
        const rounded = harness.mount(
            <RoundSize>
                <div className="inner" style={{ height: "20px", width: "30.5px" }}>
                    ...
                </div>
            </RoundSize>,
        );
        const inner = rounded.find(".inner").bounds();
        expect(inner.width).to.equal(30.5);

        const outer = rounded.find(`.${Classes.TABLE_ROUNDED_LAYOUT}`).bounds();
        expect(outer.width).to.equal(31);
    });
});
