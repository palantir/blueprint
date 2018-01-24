/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { IconClasses } from "@blueprintjs/icons";

import { Classes, Icon, IIconProps, Intent } from "../../src/index";

describe("<Icon>", () => {
    it("width=16 renders standard size", () =>
        assertIconClass(<Icon iconName="vertical-distribution" width={Icon.SIZE_STANDARD} />, Classes.ICON_STANDARD));

    it("width=20 renders large size", () =>
        assertIconClass(<Icon iconName="vertical-distribution" width={Icon.SIZE_LARGE} />, Classes.ICON_LARGE));

    it("width=inherit renders auto-size", () =>
        assertIconClass(<Icon iconName="vertical-distribution" width="inherit" />, Classes.ICON));

    it("renders intent class", () =>
        assertIconClass(<Icon iconName="add" intent={Intent.DANGER} />, Classes.INTENT_DANGER));

    it("renders iconName class", () =>
        assertIconClass(<Icon iconName="vertical-distribution" />, IconClasses.VERTICAL_DISTRIBUTION));

    it("supports prefixed iconName", () =>
        assertIconClass(<Icon iconName={IconClasses.AIRPLANE} />, IconClasses.AIRPLANE));

    it("iconName=undefined renders nothing", () => {
        const icon = shallow(<Icon iconName={undefined} />);
        assert.isTrue(icon.isEmptyRender());
    });

    /** Asserts that rendered icon has given className. */
    function assertIconClass(icon: React.ReactElement<IIconProps>, className: string) {
        const wrapper = shallow(icon);
        assert.isTrue(wrapper.hasClass(className));
        return wrapper;
    }
});
