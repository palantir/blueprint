/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Classes, Icon, IconClasses, IIconProps, Intent } from "../../src/index";

describe("<Icon>", () => {
    it("iconSize=16 renders standard size", () =>
        assertIconClass(
            <Icon iconName="vertical-distribution" iconSize={Icon.SIZE_STANDARD} />,
            Classes.ICON_STANDARD,
        ));

    it("iconSize=20 renders large size", () =>
        assertIconClass(<Icon iconName="vertical-distribution" iconSize={Icon.SIZE_LARGE} />, Classes.ICON_LARGE));

    it("iconSize=inherit renders auto-size", () =>
        assertIconClass(<Icon iconName="vertical-distribution" iconSize="inherit" />, Classes.ICON));

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
