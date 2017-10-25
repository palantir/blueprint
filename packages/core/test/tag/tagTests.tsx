/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, Tag } from "../../src/index";

describe("<Tag>", () => {
    it("renders its text", () => {
        assert.deepEqual(shallow(<Tag>Hello</Tag>).text(), "Hello");
    });

    it("renders close button when onRemove is a function", () => {
        const wrapper = shallow(<Tag onRemove={sinon.spy()}>Hello</Tag>);
        assert.lengthOf(wrapper.find(`.${Classes.TAG_REMOVE}`), 1);
    });

    it("clicking close button triggers onRemove", () => {
        const handleRemove = sinon.spy();
        shallow(<Tag onRemove={handleRemove}>Hello</Tag>)
            .find(`.${Classes.TAG_REMOVE}`)
            .simulate("click");
        assert.isTrue(handleRemove.calledOnce);
    });

    it("passes other props onto .pt-tag element", () => {
        const element = shallow(
            <Tag alt="foo bar" title="baz qux">
                Hello
            </Tag>,
        ).find(".pt-tag");
        assert.deepEqual(element.prop("alt"), "foo bar");
        assert.deepEqual(element.prop("title"), "baz qux");
    });

    it("passes all props to the onRemove handler", () => {
        const handleRemove = sinon.spy();
        const DATA_ATTR_FOO = "data-foo";
        const tagProps = {
            onRemove: handleRemove,
            [DATA_ATTR_FOO]: {
                bar: "baz",
                foo: 5,
            },
        };
        shallow(<Tag {...tagProps}>Hello</Tag>)
            .find(`.${Classes.TAG_REMOVE}`)
            .simulate("click");
        assert.isTrue(handleRemove.args.length > 0 && handleRemove.args[0].length === 2);
        assert.isTrue(handleRemove.args[0][1][DATA_ATTR_FOO] !== undefined);
        assert.deepEqual(handleRemove.args[0][1][DATA_ATTR_FOO], tagProps[DATA_ATTR_FOO]);
    });
});
