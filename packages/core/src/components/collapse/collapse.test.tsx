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

import { Classes } from "../../common";

import { Collapse } from "./collapse";

const CustomWrapper: React.FC<React.HTMLAttributes<HTMLElement>> = props => <section {...props} />;

describe("<Collapse>", () => {
    it("should render with correct className", () => {
        const { container } = render(<Collapse />);
        expect(container.firstElementChild).toHaveClass(Classes.COLLAPSE);
    });

    it("should be closed when isOpen is false", () => {
        const { container } = render(
            <Collapse isOpen={false}>
                <div>Content</div>
            </Collapse>,
        );
        const collapseBody = container.querySelector<HTMLElement>(`.${Classes.COLLAPSE_BODY}`)!;
        expect(collapseBody).toHaveAttribute("aria-hidden", "true");
    });

    it("should be open when isOpen is true", () => {
        const { container } = render(
            <Collapse isOpen={true}>
                <div style={{ height: "100px" }} />
            </Collapse>,
        );
        const collapseBody = container.querySelector<HTMLElement>(`.${Classes.COLLAPSE_BODY}`)!;
        expect(collapseBody).toHaveAttribute("aria-hidden", "false");
        expect(collapseBody).toHaveStyle({ transform: "translateY(0)" });
    });

    it("should support custom intrinsic elements", () => {
        const { container } = render(
            <Collapse component="article">
                <div>Content</div>
            </Collapse>,
        );
        const root = container.firstElementChild!;
        expect(root).not.toBeNull();
        expect(root.tagName.toLowerCase()).toBe("article");
    });

    it("should support custom components", () => {
        const { container } = render(
            <Collapse component={CustomWrapper}>
                <div>Content</div>
            </Collapse>,
        );
        const root = container.firstElementChild!;
        expect(root).not.toBeNull();
        expect(root).toHaveClass(Classes.COLLAPSE);
        expect(root.tagName.toLowerCase()).toBe("section");
    });

    it("should unmount children by default when closed", async () => {
        const { rerender } = render(
            <Collapse isOpen={true}>
                <div>Content</div>
            </Collapse>,
        );

        // Child should be visible when open
        expect(screen.getByText("Content")).toBeInTheDocument();

        // Close the collapse
        rerender(
            <Collapse isOpen={false}>
                <div>Content</div>
            </Collapse>,
        );

        // Child should be unmounted after the animation completes
        await waitFor(() => {
            expect(screen.queryByText("Content")).not.toBeInTheDocument();
        });
    });

    it("should keep children mounted when keepChildrenMounted is true", async () => {
        const { rerender } = render(
            <Collapse isOpen={true} keepChildrenMounted={true}>
                <div>Content</div>
            </Collapse>,
        );

        // Child should be visible when open
        expect(screen.getByText("Content")).toBeInTheDocument();

        // Close the collapse
        rerender(
            <Collapse isOpen={false} keepChildrenMounted={true}>
                <div>Content</div>
            </Collapse>,
        );

        // Child should still be mounted but hidden after the animation completes
        await waitFor(() => {
            const child = screen.getByText("Content");
            expect(child).toBeInTheDocument();
            expect(child.parentElement).toHaveAttribute("aria-hidden", "true");
        });
    });
});
