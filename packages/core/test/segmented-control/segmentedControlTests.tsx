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

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { Classes, type OptionProps, SegmentedControl } from "../../src";

const OPTIONS: Array<OptionProps<string>> = [
    {
        label: "List",
        value: "list",
    },
    {
        label: "Grid",
        value: "grid",
    },
    {
        label: "Gallery",
        value: "gallery",
    },
];

describe("<SegmentedControl>", () => {
    let containerElement: HTMLElement | undefined;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        containerElement?.remove();
    });

    describe("basic rendering", () => {
        it("supports className", () => {
            const testClassName = "test-class-name";
            const wrapper = mount(<SegmentedControl className={testClassName} options={OPTIONS} />, {
                attachTo: containerElement,
            });
            assert.isTrue(wrapper.find(`.${Classes.SEGMENTED_CONTROL}`).hostNodes().exists());
            assert.isTrue(wrapper.find(`.${testClassName}`).hostNodes().exists());
        });
    });
});
