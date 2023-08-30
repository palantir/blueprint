/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { Card, CardList, Classes } from "../../src";

describe("<CardList>", () => {
    it("supports className prop", () => {
        const TEST_CLASS = "test-class";
        const wrapper = mount(
            <CardList className={TEST_CLASS}>
                <Card>first</Card>
                <Card>second</Card>
            </CardList>,
        );

        assert.isTrue(wrapper.find(`.${Classes.CARD_LIST}`).hostNodes().hasClass(TEST_CLASS), TEST_CLASS);
    });

    it("supports HTML props", () => {
        const cardList = mount(<CardList title="foo" />).find("div");
        assert.strictEqual(cardList.prop("title"), "foo");
    });

    it("supports ref prop", () => {
        const elementRef = React.createRef<HTMLDivElement>();
        mount(<CardList ref={elementRef} />);
        assert.isDefined(elementRef.current);
    });
});
