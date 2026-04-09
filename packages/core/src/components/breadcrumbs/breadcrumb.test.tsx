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

import { Classes } from "../../common";

import { Breadcrumb } from "./breadcrumb";

describe("<Breadcrumb>", () => {
    it("should render its contents", () => {
        render(<Breadcrumb className="foo" text="Test" />);
        const breadcrumb = screen.getByText("Test");

        expect(breadcrumb).toHaveClass(Classes.BREADCRUMB);
        expect(breadcrumb).toHaveClass("foo");
    });

    it("should trigger onClick when clicked", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Breadcrumb onClick={onClick} text="Test" />);

        await user.click(screen.getByText("Test"));

        expect(onClick).toHaveBeenCalledOnce();
    });

    it("should not trigger onClick when disabled and clicked", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Breadcrumb disabled={true} onClick={onClick} text="Test" />);

        await user.click(screen.getByText("Test"));

        expect(onClick).not.toHaveBeenCalled();
    });

    it("should render an a tag when clickable", () => {
        const { container: container1 } = render(<Breadcrumb href="test" />);
        expect(container1.querySelector("a")).to.exist;
        expect(container1.querySelector("span")).not.toBeInTheDocument();

        const { container: container2 } = render(<Breadcrumb onClick={() => undefined} />);
        expect(container2.querySelector("a")).to.exist;
        expect(container2.querySelector("span")).not.toBeInTheDocument();
    });

    it("should render a span tag when not clickable", () => {
        const { container } = render(<Breadcrumb />);
        expect(container.querySelector("a")).not.toBeInTheDocument();
        expect(container.querySelector("span")).to.exist;
    });

    it("should render an icon when one is provided", () => {
        const { container: container1 } = render(<Breadcrumb />);
        expect(container1.querySelector(`.${Classes.ICON}`)).not.toBeInTheDocument();

        const { container: container2 } = render(<Breadcrumb icon="folder-close" />);
        expect(container2.querySelector(`.${Classes.ICON}`)).to.exist;
    });
});
