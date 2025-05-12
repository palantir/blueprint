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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "chai";
import * as React from "react";
import { spy } from "sinon";

import { Classes, InputGroup } from "../../src";

describe("<InputGroup>", () => {
    it("should render left icon before input", () => {
        render(<InputGroup leftIcon="star" />);
        const input = screen.getByRole<HTMLInputElement>("textbox");
        const inputGroup = input.parentElement;

        expect(inputGroup).to.exist;
        expect([...inputGroup!.classList]).to.include(Classes.INPUT_GROUP);
        expect([...inputGroup!.children[0].classList]).to.include(Classes.ICON);
        expect(inputGroup!.children[1]).to.equal(input);
    });

    it("should support custom props", () => {
        render(<InputGroup style={{ background: "yellow" }} tabIndex={4} />);
        const input = screen.getByRole<HTMLInputElement>("textbox");

        expect(input.style.background).to.equal("yellow");
        expect(input.tabIndex).to.equal(4);
    });

    it(`should render right element inside .${Classes.INPUT_ACTION}`, () => {
        render(<InputGroup rightElement={<div data-testid="right-element" />} />);

        expect(screen.getByTestId("right-element")).to.exist;
        const action = screen.getByTestId("right-element").parentElement;
        expect(action).to.exist;
        expect([...action!.classList]).to.include(Classes.INPUT_ACTION);
    });

    it("should support onChange callback", () => {
        const onChange = spy();
        render(<InputGroup onChange={onChange} />);
        const input = screen.getByRole<HTMLInputElement>("textbox");

        userEvent.type(input, "x");

        expect(input.value).to.equal("x");
        expect(onChange.calledOnce).to.be.true;

        const event = onChange.getCall(0).args[0] as React.ChangeEvent<HTMLInputElement>;
        expect(event.target.value).to.equal("x");
    });

    it("should support the onValueChange callback", () => {
        const onValueChange = spy();
        render(<InputGroup onValueChange={onValueChange} />);
        const input = screen.getByRole<HTMLInputElement>("textbox");

        userEvent.type(input, "x");

        expect(input.value).to.equal("x");
        expect(onValueChange.calledOnce).to.be.true;
        expect(onValueChange.getCall(0).args[0]).to.equal("x");
        expect(onValueChange.getCall(0).args[1].value).to.equal("x");
    });

    it("should support custom type attribute", () => {
        render(<InputGroup type="email" />);
        const input = screen.getByRole<HTMLInputElement>("textbox");

        expect(input.type).to.equal("email");
    });

    it("should support inputRef", () => {
        const inputRef = React.createRef<HTMLInputElement>();
        render(<InputGroup inputRef={inputRef} />);

        expect(inputRef.current).to.be.instanceOf(HTMLInputElement);
    });

    // this test was added to validate a regression introduced by AsyncControllableInput,
    // see https://github.com/palantir/blueprint/issues/4375
    it("should accept controlled update truncating input value", () => {
        function TestComponent(props: { initialValue: string; transformInput: (value: string) => string }) {
            const { initialValue, transformInput } = props;
            const [value, setValue] = React.useState(initialValue);

            const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                setValue(transformInput(event.target.value));
            };

            return <InputGroup type="text" value={value} onChange={handleChange} />;
        }

        render(<TestComponent initialValue="abc" transformInput={(value: string) => value.substring(0, 3)} />);
        const input = screen.getByRole<HTMLInputElement>("textbox");

        expect(input.value).to.equal("abc");

        userEvent.type(input, "d");

        expect(input.value).to.equal("abc");
    });
});
