/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { Tag } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { Classes, EntityTitle, H5 } from "../../src";

describe("<EntityTitle>", () => {
    let containerElement: HTMLElement | undefined;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });
    afterEach(() => {
        containerElement?.remove();
    });

    it("supports className", () => {
        const wrapper = mount(<EntityTitle className="foo" title="title" />, { attachTo: containerElement });
        assert.isFalse(wrapper.find(H5).exists(), "expected no H5");
        assert.isTrue(wrapper.find(`.foo`).exists());
    });

    it("renders title", () => {
        const wrapper = mount(<EntityTitle title="title" />, {
            attachTo: containerElement,
        });
        assert.isTrue(wrapper.find(`.${Classes.ENTITY_TITLE_TITLE}`).exists());
    });

    it("renders title in heading", () => {
        const wrapper = mount(<EntityTitle heading={H5} title="title" />, {
            attachTo: containerElement,
        });
        assert.isTrue(wrapper.find(H5).exists());
        assert.strictEqual(wrapper.find(H5).text(), "title");
    });

    it("supports icon", () => {
        const wrapper = mount(<EntityTitle icon={IconNames.GRAPH} title="title" />, { attachTo: containerElement });
        assert.isTrue(wrapper.find(`[data-icon="${IconNames.GRAPH}"]`).exists());
    });

    it("omitting icon prop removes icon from DOM", () => {
        const wrapper = mount(<EntityTitle title="title" />, { attachTo: containerElement });
        assert.isFalse(wrapper.find(`[data-icon]`).exists());
    });

    it("supports tag", () => {
        const wrapper = mount(<EntityTitle title="title" tags={<Tag>Tag</Tag>} />, { attachTo: containerElement });
        assert.isTrue(wrapper.find(`.${Classes.ENTITY_TITLE_TAGS_CONTAINER}`).exists());
    });

    it("renders optional subtitle element", () => {
        const wrapper = mount(<EntityTitle title="title" subtitle="subtitle" />, { attachTo: containerElement });
        assert.isTrue(wrapper.find(`.${Classes.ENTITY_TITLE_SUBTITLE}`).exists());
    });

    it("renders titleURL in an anchor", () => {
        const wrapper = mount(<EntityTitle title="title" titleURL="https://blueprintjs.com/" />, {
            attachTo: containerElement,
        });
        assert.isTrue(wrapper.find(`a[href="https://blueprintjs.com/"]`).exists());
        assert.isTrue(wrapper.find(`.${Classes.ENTITY_TITLE_TITLE}`).exists());
    });

    it("supports ellipsize on Text", () => {
        const wrapper = mount(<EntityTitle title="title" ellipsize={true} />, { attachTo: containerElement });
        assert.isTrue(wrapper.find(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`).exists());
    });

    it("supports ellipsize on heading", () => {
        const wrapper = mount(<EntityTitle title="title" ellipsize={true} heading={H5} />, {
            attachTo: containerElement,
        });
        assert.isTrue(wrapper.find(H5).hasClass(Classes.TEXT_OVERFLOW_ELLIPSIS));
    });

    it("supports loading", () => {
        const wrapper = mount(<EntityTitle title="title" loading={true} />, {
            attachTo: containerElement,
        });
        assert.isTrue(wrapper.find(`.${Classes.SKELETON}`).exists());
    });
});
