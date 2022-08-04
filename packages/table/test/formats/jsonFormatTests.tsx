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

/**
 * @fileoverview This component is DEPRECATED, and the code is frozen.
 * All changes & bugfixes should be made to JSONFormat2 instead.
 */

/* eslint-disable deprecation/deprecation, @blueprintjs/no-deprecated-components */

import { expect } from "chai";
import * as React from "react";

import { JSONFormat } from "../../src/cell/formats/jsonFormat";
import { TruncatedPopoverMode } from "../../src/cell/formats/truncatedFormat";
import * as Classes from "../../src/common/classes";
import { ReactHarness } from "../harness";

describe("<JSONFormat>", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("stringifies JSON", () => {
        const obj = {
            help: "me",
            "i'm": 1234,
        };
        const str = JSON.stringify(obj, null, 2);
        const comp = harness.mount(<JSONFormat>{obj}</JSONFormat>);
        expect(comp.find(`.${Classes.TABLE_TRUNCATED_FORMAT_TEXT}`)!.text()).to.equal(str);
    });

    it("omits quotes on strings and null-likes", () => {
        let comp = harness.mount(<JSONFormat>{"a string"}</JSONFormat>);
        expect(comp.find(`.${Classes.TABLE_TRUNCATED_FORMAT_TEXT}`)!.text()).to.equal("a string");

        comp = harness.mount(<JSONFormat>{null}</JSONFormat>);
        expect(comp.find(`.${Classes.TABLE_TRUNCATED_FORMAT_TEXT}`)!.text()).to.equal("null");

        comp = harness.mount(<JSONFormat>{undefined}</JSONFormat>);
        expect(comp.find(`.${Classes.TABLE_TRUNCATED_FORMAT_TEXT}`)!.text()).to.equal("undefined");
    });

    it("hides popover for null-likes, still passes showPopover prop", () => {
        let comp = harness.mount(<JSONFormat>{null}</JSONFormat>);
        expect(comp.find(`.${Classes.TABLE_TRUNCATED_POPOVER_TARGET}`)!.element).to.not.exist;

        const str = `this is a very long string that will be truncated by the following settings`;
        comp = harness.mount(
            <JSONFormat detectTruncation={false} truncateLength={10} showPopover={TruncatedPopoverMode.WHEN_TRUNCATED}>
                {str}
            </JSONFormat>,
        );
        expect(comp.find(`.${Classes.TABLE_TRUNCATED_POPOVER_TARGET}`)!.element).exist;

        comp = harness.mount(<JSONFormat showPopover={TruncatedPopoverMode.NEVER}>{str}</JSONFormat>);
        expect(comp.find(`.${Classes.TABLE_TRUNCATED_POPOVER_TARGET}`)!.element).to.not.exist;
    });
});
