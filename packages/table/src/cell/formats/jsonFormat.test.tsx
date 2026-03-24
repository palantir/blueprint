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

import { render } from "@testing-library/react";
import { expect } from "chai";

import { JSONFormat } from "../../src/cell/formats/jsonFormat";
import { TruncatedPopoverMode } from "../../src/cell/formats/truncatedFormat";
import * as Classes from "../../src/common/classes";
import { ElementHarness } from "../harness";

describe("<JSONFormat>", () => {
    it("stringifies JSON", () => {
        const obj = {
            help: "me",
            "i'm": 1234,
        };
        const str = JSON.stringify(obj, null, 2);
        const { container } = render(<JSONFormat>{obj}</JSONFormat>);
        const comp = new ElementHarness(container);
        expect(comp.find(`.${Classes.TABLE_TRUNCATED_FORMAT_TEXT}`).text()).to.equal(str);
    });

    describe("omits quotes on strings and null-likes", () => {
        it("strings", () => {
            const { container } = render(<JSONFormat>{"a string"}</JSONFormat>);
            const comp = new ElementHarness(container);
            expect(comp.find(`.${Classes.TABLE_TRUNCATED_FORMAT_TEXT}`).text()).to.equal("a string");
        });

        it("null", () => {
            const { container } = render(<JSONFormat>{null}</JSONFormat>);
            const comp = new ElementHarness(container);
            expect(comp.find(`.${Classes.TABLE_TRUNCATED_POPOVER_TARGET}`).element).to.not.exist;
            expect(comp.find(`.${Classes.TABLE_TRUNCATED_FORMAT_TEXT}`).text()).to.equal("null");
        });

        it("undefined", () => {
            const { container } = render(<JSONFormat>{undefined}</JSONFormat>);
            const comp = new ElementHarness(container);
            expect(comp.find(`.${Classes.TABLE_TRUNCATED_FORMAT_TEXT}`).text()).to.equal("undefined");
        });
    });

    describe("passes showPopover prop", () => {
        it("truncated", () => {
            const str = `this is a very long string that will be truncated by the following settings`;
            const { container } = render(
                <JSONFormat
                    detectTruncation={false}
                    truncateLength={10}
                    showPopover={TruncatedPopoverMode.WHEN_TRUNCATED}
                >
                    {str}
                </JSONFormat>,
            );
            const comp = new ElementHarness(container);
            expect(comp.find(`.${Classes.TABLE_TRUNCATED_POPOVER_TARGET}`)!.element).exist;
        });

        it("never", () => {
            const str = `this is a very long string that will be truncated by the following settings`;
            const { container } = render(<JSONFormat showPopover={TruncatedPopoverMode.NEVER}>{str}</JSONFormat>);
            const comp = new ElementHarness(container);
            expect(comp.find(`.${Classes.TABLE_TRUNCATED_POPOVER_TARGET}`)!.element).to.not.exist;
        });
    });
});
