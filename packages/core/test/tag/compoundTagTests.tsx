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
import { mount, shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { Classes, CompoundTag, Icon, Text } from "../../src";

describe("<CompoundTag>", () => {
    it("renders its text", () => {
        assert.strictEqual(
            shallow(<CompoundTag>Hello</CompoundTag>)
                .find(Text)
                .prop("children"),
            "Hello",
        );
    });

    it("text is not rendered if omitted", () => {
        assert.isFalse(
            shallow(<CompoundTag icon="tick" />)
                .find(Text)
                .exists(),
        );
    });

    it("renders icons", () => {
        const wrapper = shallow(<CompoundTag icon="tick" rightIcon="airplane" />);
        assert.lengthOf(wrapper.find(Icon), 2);
    });

    it("renders close button when onRemove is a function", () => {
        const wrapper = mount(<CompoundTag onRemove={spy()}>Hello</CompoundTag>);
        assert.lengthOf(wrapper.find(`.${Classes.TAG_REMOVE}`), 1);
    });

    it("clicking close button triggers onRemove", () => {
        const handleRemove = spy();
        mount(<CompoundTag onRemove={handleRemove}>Hello</CompoundTag>)
            .find(`.${Classes.TAG_REMOVE}`)
            .simulate("click");
        assert.isTrue(handleRemove.calledOnce);
    });

    it(`passes other props onto .${Classes.TAG} element`, () => {
        const element = mount(<CompoundTag title="baz qux">Hello</CompoundTag>).find(`.${Classes.TAG}`);
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
        mount(<CompoundTag {...tagProps}>Hello</CompoundTag>)
            .find(`.${Classes.TAG_REMOVE}`)
            .simulate("click");
        assert.isTrue(handleRemove.args.length > 0 && handleRemove.args[0].length === 2);
        assert.isTrue(handleRemove.args[0][1][DATA_ATTR_FOO] !== undefined);
        assert.deepEqual(handleRemove.args[0][1][DATA_ATTR_FOO], tagProps[DATA_ATTR_FOO]);
    });

    it("supports ref objects", done => {
        const elementRef = React.createRef<HTMLSpanElement>();
        const wrapper = mount(<CompoundTag ref={elementRef}>Hello</CompoundTag>);

        // wait for the whole lifecycle to run
        setTimeout(() => {
            assert.equal(elementRef.current, wrapper.find(`.${Classes.TAG}`).getDOMNode<HTMLSpanElement>());
            done();
        }, 0);
    });
});
