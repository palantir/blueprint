/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { IconName } from "@blueprintjs/icons";

import { Classes, Icon, IIconProps, Intent } from "../../src/index";

describe("<Icon>", () => {
    it("iconSize=16 renders standard size", () =>
        assertIconSize(<Icon icon="graph" iconSize={Icon.SIZE_STANDARD} />, Icon.SIZE_STANDARD));

    it("iconSize=20 renders large size", () =>
        assertIconSize(<Icon icon="graph" iconSize={Icon.SIZE_LARGE} />, Icon.SIZE_LARGE));

    it("renders intent class", () =>
        assert.isTrue(shallow(<Icon icon="add" intent={Intent.DANGER} />).hasClass(Classes.INTENT_DANGER)));

    it("renders icon name", () => assertIcon(<Icon icon="calendar" />, "calendar"));

    it("renders icon color", () => assertIconColor(<Icon icon="add" color="red" />, "red"));

    it("prefixed icon renders nothing", () => {
        // @ts-ignore invalid icon
        const icon = shallow(<Icon icon={Classes.iconClass("airplane")} />);
        assert.isTrue(icon.isEmptyRender());
    });

    it("passes through icon element unchanged", () => {
        // this is supported to simplify usage of this component in other Blueprint components
        // which accept `icon?: IconName | JSX.Element`.
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
        assert.strictEqual(shallow(icon).text(), iconName);
    }

    /** Asserts that rendered icon has width/height equal to size. */
    function assertIconSize(icon: React.ReactElement<IIconProps>, size: number) {
        const wrapper = shallow(icon);
        assert.strictEqual(wrapper.prop("width"), size);
        assert.strictEqual(wrapper.prop("height"), size);
    }

    /** Asserts that rendered icon has color equal to color. */
    function assertIconColor(icon: React.ReactElement<IIconProps>, color: string) {
        assert.deepEqual(shallow(icon).prop("style"), { fill: color });
    }
});
