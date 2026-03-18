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

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes, type OptionProps } from "../../common";
import { RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX } from "../../common/errors";

import { Radio } from "./controls";
import { RadioGroup } from "./radioGroup";

const emptyHandler = () => {
    return;
};

describe("<RadioGroup>", () => {
    it("should select nothing by default", () => {
        render(
            <RadioGroup onChange={emptyHandler}>
                <Radio value="one" label="One" />
                <Radio value="two" label="Two" />
            </RadioGroup>,
        );
        const radio1 = screen.getByRole<HTMLInputElement>("radio", { name: "One" });
        const radio2 = screen.getByRole<HTMLInputElement>("radio", { name: "Two" });

        expect(radio1.checked).to.be.false;
        expect(radio2.checked).to.be.false;
    });

    it("should select the value when selectedValue is set", () => {
        render(
            <RadioGroup onChange={emptyHandler} selectedValue="two">
                <Radio value="one" label="One" />
                <Radio value="two" label="Two" />
            </RadioGroup>,
        );

        const radio1 = screen.getByRole<HTMLInputElement>("radio", { name: "One" });
        const radio2 = screen.getByRole<HTMLInputElement>("radio", { name: "Two" });

        expect(radio1.checked).to.be.false;
        expect(radio2.checked).to.be.true;
    });

    it("invokes onChange handler when a radio is clicked", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <RadioGroup onChange={onChange}>
                <Radio value="one" label="One" />
                <Radio value="two" label="Two" />
            </RadioGroup>,
        );
        const radio1 = screen.getByRole<HTMLInputElement>("radio", { name: "One" });

        await user.click(radio1);

        expect(onChange).toHaveBeenCalledOnce();
        expect(onChange.mock.calls[0][0].target.value).to.equal("one");
    });

    it("renders options as radio buttons", () => {
        const OPTIONS: OptionProps[] = [
            { className: "foo", label: "A", value: "a" },
            { label: "B", value: "b" },
            { disabled: true, label: "C", value: "c" },
        ];
        render(<RadioGroup onChange={emptyHandler} options={OPTIONS} selectedValue="b" />);

        const radio1 = screen.getByRole<HTMLInputElement>("radio", { name: "A" });
        const radio1Control = radio1.closest(`.${Classes.CONTROL}`);
        const radio2 = screen.getByRole<HTMLInputElement>("radio", { name: "B" });
        const radio3 = screen.getByRole<HTMLInputElement>("radio", { name: "C" });

        expect(radio1Control).to.exist;
        expect([...radio1Control!.classList]).to.include("foo");
        expect(radio2.checked).to.be.true;
        expect(radio3.disabled).to.be.true;
    });

    it("options label defaults to value", () => {
        const OPTIONS = [{ value: "text" }, { value: 123 }];
        render(<RadioGroup onChange={emptyHandler} options={OPTIONS} />);
        const text = screen.getByRole<HTMLInputElement>("radio", { name: "text" });
        const number = screen.getByRole<HTMLInputElement>("radio", { name: "123" });

        expect(text.value).to.equal("text");
        expect(number.value).to.equal("123");
    });

    it("uses options if given both options and children (with conosle warning)", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
        render(
            <RadioGroup onChange={emptyHandler} options={[]}>
                <Radio value="one" />
            </RadioGroup>,
        );

        expect(screen.queryByRole("radio")).not.toBeInTheDocument();
        expect(warnSpy).toHaveBeenCalledWith(RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX);
        warnSpy.mockRestore();
    });

    it("renders non-Radio children too", () => {
        render(
            <RadioGroup onChange={emptyHandler}>
                <Radio />
                <div data-testid="test" />
                <Radio />
            </RadioGroup>,
        );

        expect(screen.getByTestId("test")).to.exist;
        expect(screen.getAllByRole("radio")).to.have.length(2);
    });
});
