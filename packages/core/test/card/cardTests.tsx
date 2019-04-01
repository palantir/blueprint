/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
import * as sinon from "sinon";

import { Card, Classes, H4 } from "../../src/index";

describe("<Card>", () => {
    it("supports elevation, interactive, and className props", () => {
        const wrapper = shallow(<Card elevation={3} interactive={true} className={Classes.TEXT_MUTED} />);

        assert.isTrue(wrapper.hasClass(Classes.CARD), Classes.CARD);
        assert.isTrue(wrapper.hasClass(Classes.ELEVATION_3), Classes.ELEVATION_3);
        assert.isTrue(wrapper.hasClass(Classes.INTERACTIVE), Classes.INTERACTIVE);
        assert.isTrue(wrapper.hasClass(Classes.TEXT_MUTED), Classes.TEXT_MUTED);
    });

    it("renders children", () => {
        const wrapper = shallow(
            <Card>
                <H4>Card content</H4>
            </Card>,
        );
        assert.isTrue(wrapper.find(H4).exists());
    });

    it("calls onClick when card is clicked", () => {
        const onClick = sinon.spy();
        shallow(<Card onClick={onClick} />).simulate("click");
        assert.isTrue(onClick.calledOnce);
    });

    it("supports HTML props", () => {
        const onChange = sinon.spy();
        const card = shallow(<Card onChange={onChange} title="foo" tabIndex={4000} />).find("div");
        assert.strictEqual(card.prop("onChange"), onChange);
        assert.strictEqual(card.prop("title"), "foo");
    });
});
