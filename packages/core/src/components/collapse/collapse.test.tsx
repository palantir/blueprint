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

import { render } from "@testing-library/react";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";
import { assertElement } from "@blueprintjs/test-commons/vitest-utils";

import { Classes } from "../../common";

import { Collapse } from "./collapse";

describe("<Collapse>", () => {
    it("has the correct className", () => {
        const { container } = render(<Collapse />);
        expect(container.querySelector(`.${Classes.COLLAPSE}`)).toBeInTheDocument();
    });

    it("is closed", () => {
        const { container } = render(<Collapse isOpen={false}>Body</Collapse>);
        const collapseBody = assertElement(container, `.${Classes.COLLAPSE_BODY}`);
        expect(collapseBody).toHaveAttribute("aria-hidden", "true");
        // children are not rendered when closed
        expect(container.textContent).not.toContain("Body");
    });

    it("is open", () => {
        const { container } = render(<Collapse isOpen={true}>Body</Collapse>);
        const collapse = assertElement(container, `.${Classes.COLLAPSE}`);
        expect(collapse).toHaveStyle({ height: "auto" });
    });

    it("is opening", () => {
        const { container, rerender } = render(<Collapse isOpen={false}>Body</Collapse>);
        rerender(<Collapse isOpen={true}>Body</Collapse>);
        const collapseBody = assertElement(container, `.${Classes.COLLAPSE_BODY}`);
        // When transitioning to open, children become visible and aria-hidden is removed
        expect(container.textContent).toContain("Body");
        expect(collapseBody).toHaveAttribute("aria-hidden", "false");
    });

    it("supports custom intrinsic element", () => {
        const { container } = render(<Collapse component="article" />);
        expect(container.querySelector("article")).toHaveClass(Classes.COLLAPSE);
    });

    it("supports custom Component", () => {
        // Use a simple custom component to verify the component prop is respected
        const CustomWrapper = (props: React.HTMLAttributes<HTMLElement>) => <section {...props} />;
        const { container } = render(<Collapse component={CustomWrapper} />);
        expect(container.querySelector("section")).toHaveClass(Classes.COLLAPSE);
    });

    it("unmounts children by default", () => {
        const { container } = render(
            <Collapse isOpen={false}>
                <div className="removed-child" />
            </Collapse>,
        );
        expect(container.querySelector(".removed-child")).not.toBeInTheDocument();
    });

    it("keepChildrenMounted keeps child mounted", () => {
        const { container } = render(
            <Collapse isOpen={false} keepChildrenMounted={true}>
                <div className="hidden-child" />
            </Collapse>,
        );
        expect(container.querySelector(".hidden-child")).toBeInTheDocument();
    });
});
