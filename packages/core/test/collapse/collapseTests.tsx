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

import { render, screen, waitFor } from "@testing-library/react";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes, MenuItem } from "../../src";
import { Collapse } from "../../src/components/collapse/collapse";

describe("<Collapse>", () => {
    it("should render with correct className", () => {
        render(<Collapse data-testid="collapse" />);
        const collapse = screen.getByTestId("collapse");
        expect(collapse.classList.contains(Classes.COLLAPSE)).to.be.true;
    });

    it("should be closed when isOpen is false", () => {
        render(
            <Collapse data-testid="collapse" isOpen={false}>
                Body
            </Collapse>,
        );
        const collapse = screen.getByTestId("collapse");
        const computedStyle = window.getComputedStyle(collapse);
        expect(computedStyle.height).to.equal("0px");
    });

    it("should be open when isOpen is true", async () => {
        render(
            <Collapse data-testid="collapse" isOpen={true}>
                <div style={{ height: "100px" }} />
            </Collapse>,
        );
        const collapse = screen.getByTestId("collapse");

        // Wait for animation to complete
        await waitFor(() => {
            expect(window.getComputedStyle(collapse).height).to.equal("100px");
        });
    });

    it("should support custom intrinsic elements", () => {
        render(
            <Collapse data-testid="collapse" component="article">
                Body
            </Collapse>,
        );
        const collapse = screen.getByTestId("collapse");
        expect(collapse.tagName.toLowerCase()).to.equal("article");
    });

    it("should support custom components", () => {
        render(
            <Collapse data-testid="collapse" component={MenuItem} text="Test Menu Item">
                Body
            </Collapse>,
        );
        const collapse = screen.getByTestId("collapse");
        expect(collapse.classList.contains(Classes.MENU_ITEM)).to.be.true;
    });

    it("should unmount children by default when closed", () => {
        const { rerender } = render(
            <Collapse data-testid="collapse" isOpen={true}>
                <div data-testid="child">Content</div>
            </Collapse>,
        );

        // Child should be visible when open
        expect(screen.getByTestId("child")).to.exist;

        // Close the collapse
        rerender(
            <Collapse data-testid="collapse" isOpen={false}>
                <div data-testid="child">Content</div>
            </Collapse>,
        );

        // Child should be unmounted
        expect(screen.queryByTestId("child")).to.not.exist;
    });

    it("should keep children mounted when keepChildrenMounted is true", () => {
        const { rerender } = render(
            <Collapse data-testid="collapse" isOpen={true} keepChildrenMounted={true}>
                <div data-testid="child">Content</div>
            </Collapse>,
        );

        // Child should be visible when open
        expect(screen.getByTestId("child")).to.exist;

        // Close the collapse
        rerender(
            <Collapse data-testid="collapse" isOpen={false} keepChildrenMounted={true}>
                <div data-testid="child">Content</div>
            </Collapse>,
        );

        // Child should still be mounted but hidden
        const child = screen.getByTestId("child");
        expect(child).to.exist;
        expect(window.getComputedStyle(child.parentElement!).height).to.equal("auto");
    });
});
