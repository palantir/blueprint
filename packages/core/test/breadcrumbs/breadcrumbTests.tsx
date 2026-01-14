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
import { spy } from "sinon";
import { describe, expect, test as it } from "vitest";

import { Breadcrumb, Classes } from "../../src";
import { hasClass } from "../utils";

describe("<Breadcrumb>", () => {
    it("should render its contents", () => {
        render(<Breadcrumb className="foo" text="Test" />);
        const breadcrumb = screen.getByText("Test");

        expect(hasClass(breadcrumb, Classes.BREADCRUMB)).toBe(true);
        expect(hasClass(breadcrumb, "foo")).toBe(true);
    });

    it("should trigger onClick when clicked", async () => {
        const onClick = spy();
        render(<Breadcrumb onClick={onClick} text="Test" />);

        await userEvent.click(screen.getByText("Test"));

        expect(onClick.calledOnce).toBe(true);
    });

    it("should not trigger onClick when disabled and clicked", async () => {
        const onClick = spy();
        render(<Breadcrumb disabled={true} onClick={onClick} text="Test" />);

        await userEvent.click(screen.getByText("Test"));

        expect(onClick.notCalled).toBe(true);
    });

    it("should render an a tag when clickable", () => {
        const { container: container1 } = render(<Breadcrumb href="test" />);
        expect(container1.querySelector("a")).toBeDefined();
        expect(container1.querySelector("span")).toBeNull();

        const { container: container2 } = render(<Breadcrumb onClick={() => undefined} />);
        expect(container2.querySelector("a")).toBeDefined();
        expect(container2.querySelector("span")).toBeNull();
    });

    it("should render a span tag when not clickable", () => {
        const { container } = render(<Breadcrumb />);
        expect(container.querySelector("a")).toBeNull();
        expect(container.querySelector("span")).toBeDefined();
    });

    it("should render an icon when one is provided", () => {
        const { container: container1 } = render(<Breadcrumb />);
        expect(container1.querySelector(`.${Classes.ICON}`)).toBeNull();

        const { container: container2 } = render(<Breadcrumb icon="folder-close" />);
        expect(container2.querySelector(`.${Classes.ICON}`)).toBeDefined();
    });
});
