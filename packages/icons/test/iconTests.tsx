/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";

import { intentClass } from "../src/common/classes";
import { Intent } from "../src/common/intent";
import { AddIcon, AirplaneIcon, CalendarIcon, GraphIcon, Icon, IconName, IIconProps } from "../src/index";

const INTENT_DANGER: Intent = "danger";

describe("<Icon>", () => {
    it("iconSize=16 renders standard size", () =>
        assertIconSize(<GraphIcon iconSize={Icon.SIZE_STANDARD} />, Icon.SIZE_STANDARD));

    it("iconSize=20 renders large size", () =>
        assertIconSize(<GraphIcon iconSize={Icon.SIZE_LARGE} />, Icon.SIZE_LARGE));

    it("renders intent class", () =>
        assert.isTrue(unwrap(<AddIcon intent={INTENT_DANGER} />).hasClass(intentClass(INTENT_DANGER))));

    it("renders icon name", () => assertIcon(<CalendarIcon />, "calendar"));

    it("renders icon color", () => assertIconColor(<AddIcon color="red" />, "red"));

    it("prefixed icon renders nothing", () => {
        // @ts-ignore invalid icon
        const icon = shallow(<Icon icon="pt-icon-airplane" />);
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

    it("title sets content of <title> element", () => {
        const icon = unwrap(<AirplaneIcon title="bird" />);
        assert.equal(icon.find("title").text(), "bird");
    });

    it("title defaults to icon name", () => {
        const icon = unwrap(<AirplaneIcon />);
        assert.equal(icon.find("title").text(), "airplane");
    });

    /** Asserts that rendered icon has given className. */
    function assertIcon(icon: React.ReactElement<IIconProps>, iconName: IconName) {
        assert.strictEqual(unwrap(icon).text(), iconName);
    }

    /** Asserts that rendered icon has width/height equal to size. */
    function assertIconSize(icon: React.ReactElement<IIconProps>, size: number) {
        const wrapper = unwrap(icon);
        assert.strictEqual(wrapper.prop("width"), size);
        assert.strictEqual(wrapper.prop("height"), size);
    }

    /** Asserts that rendered icon has color equal to color. */
    function assertIconColor(icon: React.ReactElement<IIconProps>, color: string) {
        assert.deepEqual(unwrap(icon).prop("style"), { fill: color });
    }

    function unwrap(icon: React.ReactElement<IIconProps>) {
        const wrapper = mount(icon);
        return wrapper.find("svg");
    }
});
