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
import { mount } from "enzyme";
import React from "react";
import { spy } from "sinon";

import { Classes, Icon, InputGroup } from "../../src";

describe("<InputGroup>", () => {
    it("renders left icon before input", () => {
        const input = mount(<InputGroup leftIcon="star" />).children();
        assert.isTrue(input.childAt(0).is(Icon));
        assert.isTrue(input.childAt(1).hasClass(Classes.INPUT));
    });

    it("supports custom props", () => {
        const input = mount(<InputGroup leftIcon="star" style={{ background: "yellow" }} tabIndex={4} />);
        const inputElement = input.find("input").getDOMNode() as HTMLElement;
        assert.equal(inputElement.style.background, "yellow");
        assert.equal(inputElement.tabIndex, 4);
    });

    it(`renders right element inside .${Classes.INPUT_ACTION} after input`, () => {
        const action = mount(<InputGroup rightElement={<address />} />)
            .children()
            .childAt(1);
        assert.isTrue(action.hasClass(Classes.INPUT_ACTION));
        assert.lengthOf(action.find("address"), 1);
    });

    it("works like a text input", () => {
        const changeSpy = spy();
        const input = mount(<InputGroup value="value" onChange={changeSpy} />).find("input");
        assert.strictEqual(input.prop("type"), "text");
        assert.strictEqual(input.prop("value"), "value");

        input.simulate("change");
        assert.isTrue(changeSpy.calledOnce, "onChange not called");
    });

    it("supports custom type attribute", () => {
        const group = mount(<InputGroup type="email" />);
        assert.strictEqual(group.find("input").prop("type"), "email");

        group.setProps({ type: "password" });
        assert.strictEqual(group.find("input").prop("type"), "password");
    });

    it("supports inputRef", () => {
        let input: HTMLInputElement | null = null;
        // tslint:disable-next-line:jsx-no-lambda
        mount(<InputGroup inputRef={ref => (input = ref)} />);
        assert.instanceOf(input, HTMLInputElement);
    });

    // this test was added to validate a regression introduced by AsyncControllableInput,
    // see https://github.com/palantir/blueprint/issues/4375
    it("accepts controlled update truncating the input value", () => {
        class TestComponent extends React.PureComponent<
            { initialValue: string; transformInput: (value: string) => string },
            { value: string }
        > {
            public state = { value: this.props.initialValue };

            public render() {
                return <InputGroup type="text" value={this.state.value} onChange={this.handleChange} />;
            }

            private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({
                    value: this.props.transformInput(e.target.value),
                });
            };
        }

        const wrapper = mount(
            <TestComponent
                initialValue="abc"
                // tslint:disable-next-line:jsx-no-lambda
                transformInput={(value: string) => value.substr(0, 3)}
            />,
        );

        let input = wrapper.find("input");
        assert.strictEqual(input.prop("value"), "abc");

        input.simulate("change", { target: { value: "abcd" } });
        input = wrapper.find("input");
        // value should not change because our change handler prevents it from being longer than characters
        assert.strictEqual(input.prop("value"), "abc");
    });
});
