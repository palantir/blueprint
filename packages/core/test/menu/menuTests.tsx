/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Classes, H6, Menu, MenuDivider, MenuItem } from "../../src/index";

describe("<MenuDivider>", () => {
    it("React renders MenuDivider", () => {
        const divider = shallow(<MenuDivider />);
        assert.isTrue(divider.hasClass(Classes.MENU_DIVIDER));
    });

    it("React renders MenuDivider with title", () => {
        const divider = shallow(<MenuDivider title="Subject" />);
        assert.isFalse(divider.hasClass(Classes.MENU_DIVIDER));
        assert.isTrue(divider.hasClass(Classes.MENU_HEADER));
        assert.isTrue(divider.find(H6).exists());
    });
});

describe("<Menu>", () => {
    it("React renders Menu with children", () => {
        const menu = shallow(
            <Menu>
                <MenuItem icon="graph" text="Graph" />
            </Menu>,
        );
        assert.isTrue(menu.hasClass(Classes.MENU));
        assert.lengthOf(menu.find(MenuItem), 1);
    });
});
