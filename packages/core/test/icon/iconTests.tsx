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
import { type SinonStub, stub } from "sinon";

import { type IconName, Icons, IconSize } from "@blueprintjs/icons";
// tslint:disable-next-line no-submodule-imports
import { Add, Airplane, Calendar, Graph } from "@blueprintjs/icons/lib/cjs/generated/16px/paths";

import { Classes, Icon, type IconProps, Intent } from "../../src";

describe("<Icon>", () => {
    let iconLoader: SinonStub;

    before(() => {
        stub(Icons, "load").resolves(undefined);
        // stub the dynamic icon loader with a synchronous, static one
        iconLoader = stub(Icons, "getPaths");
        iconLoader.returns(undefined);
        iconLoader.withArgs("add").returns(Add);
        iconLoader.withArgs("airplane").returns(Airplane);
        iconLoader.withArgs("calendar").returns(Calendar);
        iconLoader.withArgs("graph").returns(Graph);
    });

    afterEach(() => {
        iconLoader?.resetHistory();
    });

    it("tagName dictates HTML tag", async () => {
        const wrapper = mount(<Icon icon="calendar" tagName="i" />);
        wrapper.update();
        assert.isTrue(wrapper.find("i").exists());
    });

    it("size=16 renders standard size", async () =>
        assertIconSize(<Icon icon="graph" size={IconSize.STANDARD} />, IconSize.STANDARD));

    it("size=20 renders large size", async () =>
        assertIconSize(<Icon icon="graph" size={IconSize.LARGE} />, IconSize.LARGE));

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
        wrapper.update();
        assert.lengthOf(wrapper.find("path"), 0);
    });

    it("prefixed icon renders blank icon", async () => {
        const wrapper = mount(<Icon icon={Classes.iconClass("airplane") as any} />);
        wrapper.update();
        assert.lengthOf(wrapper.find("path"), 0);
    });

    it("icon element passes through unchanged", async () => {
        // NOTE: This is supported to simplify usage of this component in other
        // Blueprint components which accept `icon?: IconName | JSX.Element`.
        const onClick = () => true;
        const wrapper = mount(<Icon icon={<article onClick={onClick} />} />);
        wrapper.update();
        assert.isTrue(wrapper.childAt(0).is("article"));
        assert.strictEqual(wrapper.find("article").prop("onClick"), onClick);
    });

    it("icon=undefined renders nothing", async () => {
        const wrapper = mount(<Icon icon={undefined} />);
        wrapper.update();
        assert.isTrue(wrapper.isEmptyRender());
    });

    it("title sets content of <title> element", async () => {
        const wrapper = mount(<Icon icon="airplane" title="bird" />);
        wrapper.update();
        assert.equal(wrapper.find("title").text(), "bird");
    });

    it("does not add desc if title is not provided", () => {
        const icon = mount(<Icon icon="airplane" />);
        assert.isEmpty(icon.find("desc"));
    });

    it("applies aria-hidden=true if title is not defined", () => {
        const icon = mount(<Icon icon="airplane" />);
        assert.isTrue(icon.find(`.${Classes.ICON}`).hostNodes().prop("aria-hidden"));
    });

    it("supports mouse event handlers of type React.MouseEventHandler", () => {
        const handleClick: React.MouseEventHandler = () => undefined;
        mount(<Icon icon="add" onClick={handleClick} />);
    });

    it("accepts HTML attributes", () => {
        mount(<Icon<HTMLSpanElement> icon="drag-handle-vertical" draggable={false} />);
    });

    it("accepts generic type param specifying the type of the root element", () => {
        const handleClick: React.MouseEventHandler<HTMLSpanElement> = () => undefined;
        mount(<Icon<HTMLSpanElement> icon="add" onClick={handleClick} />);
    });

    it("allows specifying the root element as <svg> when tagName={null}", () => {
        const handleClick: React.MouseEventHandler<SVGSVGElement> = () => undefined;
        mount(<Icon<SVGSVGElement> icon="add" onClick={handleClick} tagName={null} />);
    });

    /** Asserts that rendered icon has an SVG path. */
    async function assertIconHasPath(icon: React.ReactElement<IconProps>, iconName: IconName) {
        const wrapper = mount(icon);
        wrapper.update();
        assert.strictEqual(wrapper.text(), iconName);
        assert.isAbove(wrapper.find("path").length, 0, "should find at least one path element");
    }

    /** Asserts that rendered icon has width/height equal to size. */
    async function assertIconSize(icon: React.ReactElement<IconProps>, size: number) {
        const wrapper = mount(icon);
        wrapper.update();
        const svg = wrapper.find("svg");
        assert.strictEqual(svg.prop("width"), size);
        assert.strictEqual(svg.prop("height"), size);
    }

    /** Asserts that rendered icon has color equal to color. */
    async function assertIconColor(icon: React.ReactElement<IconProps>, color?: string) {
        const wrapper = mount(icon);
        wrapper.update();
        const svg = wrapper.find("svg");
        assert.deepEqual(svg.prop("fill"), color);
    }
});
