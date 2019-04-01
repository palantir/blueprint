/*
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

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { Classes, ProgressBar } from "../../src/index";

describe("ProgressBar", () => {
    it("renders a PROGRESS_BAR", () => {
        assert.lengthOf(mount(<ProgressBar />).find("." + Classes.PROGRESS_BAR), 1);
    });

    it("does not set width by default", () => {
        const root = mount(<ProgressBar />);
        assert.isNull(root.find("." + Classes.PROGRESS_METER).prop("style").width);
    });

    it("value sets width percentage", () => {
        const root = mount(<ProgressBar value={0.35} />);
        assert.strictEqual(root.find("." + Classes.PROGRESS_METER).prop("style").width, "35%");
    });
});
