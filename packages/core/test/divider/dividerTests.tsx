/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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
import { expect } from "chai";

import { Classes, Divider } from "../../src";
import { hasClass } from "../utils";

describe("<Divider>", () => {
    it("should render with default className", () => {
        const { container } = render(<Divider />);
        const divider = container.querySelector(`.${Classes.DIVIDER}`);

        expect(divider).to.exist;
    });

    it("should support custom className", () => {
        const { container } = render(<Divider className="custom-class" />);
        const divider = container.querySelector(`.${Classes.DIVIDER}`);

        expect(hasClass(divider!, "custom-class")).to.be.true;
    });

    it("should support compact prop", () => {
        const { container } = render(<Divider compact={true} />);
        const divider = container.querySelector(`.${Classes.DIVIDER}`);

        expect(hasClass(divider!, Classes.COMPACT)).to.be.true;
    });

    it("should render with custom tagName", () => {
        const { container } = render(<Divider tagName="hr" />);
        const divider = container.querySelector("hr");

        expect(divider).to.exist;
        expect(hasClass(divider!, Classes.DIVIDER)).to.be.true;
    });

    describe("with text", () => {
        it("should render text content", () => {
            render(<Divider>Section Title</Divider>);
            const textContent = screen.getByText("Section Title");

            expect(textContent).to.exist;
        });

        it("should apply text-related classes", () => {
            const { container } = render(<Divider>Section Title</Divider>);
            const divider = container.querySelector(`.${Classes.DIVIDER}`);

            expect(hasClass(divider!, `${Classes.DIVIDER}-with-text`)).to.be.true;
        });

        it("should not add unnecessary class for default center alignment", () => {
            const { container } = render(<Divider>Section Title</Divider>);
            const divider = container.querySelector(`.${Classes.DIVIDER}`);

            expect(hasClass(divider!, `${Classes.DIVIDER}-text-center`)).to.be.false;
        });

        it("should support textAlignment prop", () => {
            const { container } = render(<Divider textAlignment="left">Section Title</Divider>);
            const divider = container.querySelector(`.${Classes.DIVIDER}`);

            expect(hasClass(divider!, `${Classes.DIVIDER}-text-left`)).to.be.true;
        });

        it("should support textAlignment=right", () => {
            const { container } = render(<Divider textAlignment="right">Section Title</Divider>);
            const divider = container.querySelector(`.${Classes.DIVIDER}`);

            expect(hasClass(divider!, `${Classes.DIVIDER}-text-right`)).to.be.true;
        });

        it("should have role=separator when text is present", () => {
            const { container } = render(<Divider>Section Title</Divider>);
            const divider = container.querySelector('[role="separator"]');

            expect(divider).to.exist;
        });

        it("should wrap text content in text-content span", () => {
            const { container } = render(<Divider>Section Title</Divider>);
            const textWrapper = container.querySelector(`.${Classes.DIVIDER}-text-content`);

            expect(textWrapper).to.exist;
            expect(textWrapper?.textContent).to.equal("Section Title");
        });
    });

    describe("without text", () => {
        it("should not have text-related classes", () => {
            const { container } = render(<Divider />);
            const divider = container.querySelector(`.${Classes.DIVIDER}`);

            expect(hasClass(divider!, `${Classes.DIVIDER}-with-text`)).to.be.false;
        });

        it("should not have role attribute", () => {
            const { container } = render(<Divider />);
            const divider = container.querySelector(`.${Classes.DIVIDER}`);

            expect(divider?.hasAttribute("role")).to.be.false;
        });
    });
});
