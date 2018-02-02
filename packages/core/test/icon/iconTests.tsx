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

    it("renders iconName class", () => assertIcon(<Icon icon="calendar" />, "calendar"));

    // uncomment for compiler error
    // it("does not support prefixed iconName", () => assertIcon(<Icon icon={IconClasses.AIRPLANE} />, "airplane"));

    it("icon=undefined renders nothing", () => {
        const icon = shallow(<Icon icon={undefined} />);
        assert.isTrue(icon.isEmptyRender());
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
});
