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
import { shallow } from "enzyme";
import * as React from "react";

import { IconName } from "@blueprintjs/icons";

import { Classes, Icon, IIconProps, Intent } from "../../src/index";

describe("<Icon>", () => {
    it("tagName dictates HTML tag", () => {
        const icon = shallow(<Icon icon="calendar" />);
        assert.isTrue(icon.is("span"));
        assert.isTrue(icon.setProps({ tagName: "article" }).is("article"));
    });

    it("iconSize=16 renders standard size", () =>
        assertIconSize(<Icon icon="graph" iconSize={Icon.SIZE_STANDARD} />, Icon.SIZE_STANDARD));

    it("iconSize=20 renders large size", () =>
        assertIconSize(<Icon icon="graph" iconSize={Icon.SIZE_LARGE} />, Icon.SIZE_LARGE));

    it("renders intent class", () =>
        assert.isTrue(shallow(<Icon icon="add" intent={Intent.DANGER} />).hasClass(Classes.INTENT_DANGER)));

    it("renders icon name", () => {
        assertIcon(<Icon icon="calendar" />, "calendar");
    });

    it("renders icon without color", () => {
        assertIconColor(<Icon icon="add" />);
    });

    it("renders icon color", () => {
        assertIconColor(<Icon icon="add" color="red" />, "red");
    });

    it("unknown icon name renders blank icon", () => {
        assert.lengthOf(shallow(<Icon icon={"unknown" as any} />).find("path"), 0);
    });

    it("prefixed icon renders blank icon", () => {
        assert.lengthOf(shallow(<Icon icon={Classes.iconClass("airplane") as any} />).find("path"), 0);
    });

    it("icon element passes through unchanged", () => {
        // NOTE: This is supported to simplify usage of this component in other
        // Blueprint components which accept `icon?: IconName | JSX.Element`.
        const onClick = () => true;
        const icon = shallow(<Icon icon={<article onClick={onClick} />} />);
        assert.isTrue(icon.is("article"));
        assert.strictEqual(icon.find("article").prop("onClick"), onClick);
    });

    it("icon=undefined renders nothing", () => {
        const icon = shallow(<Icon icon={undefined} />);
        assert.isTrue(icon.isEmptyRender());
    });

    it("title sets content of <desc> element", () => {
        const icon = shallow(<Icon icon="airplane" title="bird" />);
        assert.equal(icon.find("desc").text(), "bird");
    });

    it("desc defaults to icon name", () => {
        const icon = shallow(<Icon icon="airplane" />);
        assert.equal(icon.find("desc").text(), "airplane");
    });

    /** Asserts that rendered icon has given className. */
    function assertIcon(icon: React.ReactElement<IIconProps>, iconName: IconName) {
        const wrapper = shallow(icon);
        assert.strictEqual(wrapper.text(), iconName);
        assert.isAbove(wrapper.find("path").length, 0, "should find at least one path element");
    }

    /** Asserts that rendered icon has width/height equal to size. */
    function assertIconSize(icon: React.ReactElement<IIconProps>, size: number) {
        const svg = shallow(icon).find("svg");
        assert.strictEqual(svg.prop("width"), size);
        assert.strictEqual(svg.prop("height"), size);
    }

    /** Asserts that rendered icon has color equal to color. */
    function assertIconColor(icon: React.ReactElement<IIconProps>, color?: string) {
        const svg = shallow(icon).find("svg");
        assert.deepEqual(svg.prop("fill"), color);
    }
});
