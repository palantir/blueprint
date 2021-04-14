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
import React from "react";

import { Icons, IconName } from "@blueprintjs/icons";

import { Classes, Icon, IconProps, Intent } from "../../src";

describe("<Icon>", () => {
    before(async () => {
        await Icons.load(["graph", "add", "calendar", "airplane"]);
    });

    it("tagName dictates HTML tag", async () => {
        const wrapper = mount(<Icon icon="calendar" tagName="i" />);
        await wrapper.instance().componentDidMount!();
        wrapper.update();
        assert.isTrue(wrapper.find("i").exists());
    });

    it("size=16 renders standard size", async () =>
        assertIconSize(<Icon icon="graph" size={Icon.SIZE_STANDARD} />, Icon.SIZE_STANDARD));

    it("size=20 renders large size", async () =>
        assertIconSize(<Icon icon="graph" size={Icon.SIZE_LARGE} />, Icon.SIZE_LARGE));

    it("renders intent class", async () => {
        const wrapper = mount(<Icon icon="add" intent={Intent.DANGER} />);
        assert.isTrue(wrapper.find(`.${Classes.INTENT_DANGER}`).exists());
    });

    it("renders icon name", async () => {
        assertIconHasPath(<Icon icon="calendar" />, "calendar");
    });

    it("renders icon without color", async () => {
        assertIconColor(<Icon icon="add" />);
    });

    it("renders icon color", async () => {
        assertIconColor(<Icon icon="add" color="red" />, "red");
    });

    it("unknown icon name renders blank icon", async () => {
        const wrapper = mount(<Icon icon={"unknown" as any} />);
        await wrapper.instance().componentDidMount!();
        wrapper.update();
        assert.lengthOf(wrapper.find("path"), 0);
    });

    it("prefixed icon renders blank icon", async () => {
        const wrapper = mount(<Icon icon={Classes.iconClass("airplane") as any} />);
        await wrapper.instance().componentDidMount!();
        wrapper.update();
        assert.lengthOf(wrapper.find("path"), 0);
    });

    it("icon element passes through unchanged", async () => {
        // NOTE: This is supported to simplify usage of this component in other
        // Blueprint components which accept `icon?: IconName | JSX.Element`.
        const onClick = () => true;
        const wrapper = mount(<Icon icon={<article onClick={onClick} />} />);
        await wrapper.instance().componentDidMount!();
        wrapper.update();
        assert.isTrue(wrapper.childAt(0).is("article"));
        assert.strictEqual(wrapper.find("article").prop("onClick"), onClick);
    });

    it("icon=undefined renders nothing", async () => {
        const wrapper = mount(<Icon icon={undefined} />);
        await wrapper.instance().componentDidMount!();
        wrapper.update();
        assert.isTrue(wrapper.isEmptyRender());
    });

    it("title sets content of <desc> element", async () => {
        const wrapper = mount(<Icon icon="airplane" title="bird" />);
        await wrapper.instance().componentDidMount!();
        wrapper.update();
        assert.equal(wrapper.find("desc").text(), "bird");
    });

    it("desc defaults to icon name", async () => {
        const wrapper = mount(<Icon icon="airplane" />);
        await wrapper.instance().componentDidMount!();
        wrapper.update();
        assert.equal(wrapper.find("desc").text(), "airplane");
    });

    /** Asserts that rendered icon has an SVG path. */
    async function assertIconHasPath(icon: React.ReactElement<IconProps>, iconName: IconName) {
        const wrapper = mount(icon);
        await wrapper.instance().componentDidMount!();
        wrapper.update();
        assert.strictEqual(wrapper.text(), iconName);
        assert.isAbove(wrapper.find("path").length, 0, "should find at least one path element");
    }

    /** Asserts that rendered icon has width/height equal to size. */
    async function assertIconSize(icon: React.ReactElement<IconProps>, size: number) {
        const wrapper = mount(icon);
        await wrapper.instance().componentDidMount!();
        wrapper.update();
        const svg = wrapper.find("svg");
        assert.strictEqual(svg.prop("width"), size);
        assert.strictEqual(svg.prop("height"), size);
    }

    /** Asserts that rendered icon has color equal to color. */
    async function assertIconColor(icon: React.ReactElement<IconProps>, color?: string) {
        const wrapper = mount(icon);
        await wrapper.instance().componentDidMount!();
        wrapper.update();
        const svg = wrapper.find("svg");
        assert.deepEqual(svg.prop("fill"), color);
    }
});
