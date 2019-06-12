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
import { spy } from "sinon";

import { Classes, Icon, Tag, Text } from "../../src/index";

describe("<Tag>", () => {
    it("renders its text", () => {
        assert.strictEqual(
            shallow(<Tag>Hello</Tag>)
                .find(Text)
                .prop("children"),
            "Hello",
        );
    });

    it("text is not rendered if omitted", () => {
        assert.isFalse(
            shallow(<Tag icon="tick" />)
                .find(Text)
                .exists(),
        );
    });

    it("renders icons", () => {
        const wrapper = shallow(<Tag icon="tick" rightIcon="airplane" />);
        assert.lengthOf(wrapper.find(Icon), 2);
    });

    it("renders close button when onRemove is a function", () => {
        const wrapper = shallow(<Tag onRemove={spy()}>Hello</Tag>);
        assert.lengthOf(wrapper.find(`.${Classes.TAG_REMOVE}`), 1);
    });

    it("clicking close button triggers onRemove", () => {
        const handleRemove = spy();
        shallow(<Tag onRemove={handleRemove}>Hello</Tag>)
            .find(`.${Classes.TAG_REMOVE}`)
            .simulate("click");
        assert.isTrue(handleRemove.calledOnce);
    });

    it(`passes other props onto .${Classes.TAG} element`, () => {
        const element = shallow(<Tag title="baz qux">Hello</Tag>).find("." + Classes.TAG);
        assert.deepEqual(element.prop("title"), "baz qux");
    });

    it("passes all props to the onRemove handler", () => {
        const handleRemove = spy();
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
