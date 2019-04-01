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
import { mount, shallow } from "enzyme";
import * as React from "react";

import { AnimationStates, Classes, Collapse, MenuItem } from "../../src/index";

describe("<Collapse>", () => {
    it("has the correct className", () => {
        const collapse = shallow(<Collapse />);
        assert.isTrue(collapse.hasClass(Classes.COLLAPSE));
    });

    it("is closed", () => {
        const collapse = mount(<Collapse isOpen={false}>Body</Collapse>);
        assert.strictEqual(collapse.state("height"), "0px");
    });

    it("is open", () => {
        const collapse = mount(<Collapse isOpen={true}>Body</Collapse>);
        assert.strictEqual(collapse.state("height"), "auto");
    });

    it("is opening", () => {
        const collapse = mount(<Collapse isOpen={false}>Body</Collapse>);
        collapse.setProps({ isOpen: true });
        assert.strictEqual(collapse.state("animationState"), AnimationStates.OPENING);
    });

    it("supports custom intrinsic element", () => {
        assert.isTrue(shallow(<Collapse component="article" />).is("article"));
    });

    it("supports custom Component", () => {
        assert.isTrue(shallow(<Collapse component={MenuItem} />).is(MenuItem));
    });

    it("unmounts children by default", () => {
        const collapse = mount(
            <Collapse isOpen={false}>
                <div className="removed-child" />
            </Collapse>,
        );
        assert.lengthOf(collapse.find(".removed-child"), 0);
    });

    it("keepChildrenMounted keeps child mounted", () => {
        const collapse = mount(
            <Collapse isOpen={false} keepChildrenMounted={true}>
                <div className="hidden-child" />
            </Collapse>,
        );
        assert.lengthOf(collapse.find(".hidden-child"), 1);
    });
});
