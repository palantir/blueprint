/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { IconNames } from "@blueprintjs/icons";

import { Callout, Classes, H5, Intent } from "../../src";

describe("<Callout>", () => {
    let containerElement: HTMLElement | undefined;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });
    afterEach(() => {
        containerElement?.remove();
    });

    it("supports className", () => {
        const wrapper = mount(<Callout className="foo" />, { attachTo: containerElement });
        assert.isFalse(wrapper.find(H5).exists(), "expected no H5");
        assert.isTrue(wrapper.find(`.${Classes.CALLOUT}`).hostNodes().exists());
        assert.isTrue(wrapper.find(`.foo`).hostNodes().exists());
    });

    it("supports icon", () => {
        const wrapper = mount(<Callout icon={IconNames.GRAPH} />, { attachTo: containerElement });
        assert.isTrue(wrapper.find(`[data-icon="${IconNames.GRAPH}"]`).exists());
    });

    it("supports intent", () => {
        const wrapper = mount(<Callout intent={Intent.DANGER} />, { attachTo: containerElement });
        assert.isTrue(wrapper.find(`.${Classes.INTENT_DANGER}`).hostNodes().exists());
    });

    it("intent='primary' renders the associated default icon", () => {
        const wrapper = mount(<Callout intent={Intent.PRIMARY} />, { attachTo: containerElement });
        assert.isTrue(wrapper.find(`[data-icon="${IconNames.INFO_SIGN}"]`).exists());
    });

    it("icon=null removes intent icon", () => {
        const wrapper = mount(<Callout icon={null} intent={Intent.PRIMARY} />, { attachTo: containerElement });
        assert.isFalse(wrapper.find(`[data-icon]`).exists());
    });

    it("renders optional title element", () => {
        const wrapper = mount(<Callout title="title" />, { attachTo: containerElement });
        assert.isTrue(wrapper.find(H5).exists());
        // NOTE: JSX cannot be passed through `title` prop due to conflict with HTML props
        // @ts-expect-error
        mount(<Callout title={<em>typings fail</em>} />);
    });
});
