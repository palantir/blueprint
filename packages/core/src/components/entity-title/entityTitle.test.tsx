/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { Tag } from "../../index";
import { H5 } from "../html/html";

import { EntityTitle } from "./entityTitle";

describe("<EntityTitle>", () => {
    it("supports className", () => {
        const { container } = render(<EntityTitle className="foo" title="title" />);
        expect(container.querySelector("h5")).not.toBeInTheDocument();
        expect(container.querySelector(".foo")).toBeInTheDocument();
    });

    it("renders title", () => {
        render(<EntityTitle title="title" />);
        const title = screen.getByText<HTMLDivElement>("title");
        expect(title).toHaveClass(Classes.ENTITY_TITLE_TITLE);
    });

    it("renders title in heading", () => {
        render(<EntityTitle heading={H5} title="title" />);
        const title = screen.getByText<HTMLHeadingElement>("title");
        expect(title.tagName.toLowerCase()).toBe("h5");
    });

    it("supports icon", () => {
        const { container } = render(<EntityTitle icon="graph" title="title" />);
        expect(container.querySelector(`[data-icon="graph"]`)).toBeInTheDocument();
    });

    it("omitting icon prop removes icon from DOM", () => {
        const { container } = render(<EntityTitle title="title" />);
        expect(container.querySelector("[data-icon]")).not.toBeInTheDocument();
    });

    it("supports tag", () => {
        render(<EntityTitle title="title" tags={<Tag>tag</Tag>} />);
        expect(screen.getByText("tag")).toBeInTheDocument();
    });

    it("renders optional subtitle element", () => {
        render(<EntityTitle title="title" subtitle="subtitle" />);
        expect(screen.getByText("subtitle")).toBeInTheDocument();
    });

    it("renders title in an anchor", () => {
        render(<EntityTitle title="title" titleURL="https://blueprintjs.com/" />);
        const title = screen.getByText<HTMLAnchorElement>("title");
        expect(title.tagName.toLowerCase()).toBe("a");
        expect(title).toHaveAttribute("href", "https://blueprintjs.com/");
    });

    it("supports ellipsize on Text", () => {
        render(<EntityTitle title="title" ellipsize={true} />);
        const title = screen.getByText<HTMLDivElement>("title");
        expect(title).toHaveClass(Classes.TEXT_OVERFLOW_ELLIPSIS);
    });

    it("supports ellipsize on heading", () => {
        render(<EntityTitle title="title" ellipsize={true} heading={H5} />);
        const title = screen.getByText<HTMLHeadingElement>("title");
        expect(title).toHaveClass(Classes.TEXT_OVERFLOW_ELLIPSIS);
    });

    it("supports fill", () => {
        const { container } = render(<EntityTitle title="title" fill={true} />);
        expect(container.querySelector(`.${Classes.FILL}`)).toBeInTheDocument();
    });

    it("supports loading", () => {
        render(<EntityTitle title="title" loading={true} />);
        const title = screen.getByText<HTMLDivElement>("title");
        expect(title).toHaveClass(Classes.SKELETON);
    });
});
