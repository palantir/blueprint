/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { IconNames } from "@blueprintjs/icons";
import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { H5 } from "../html/html";

import { Section } from "./section";
import { SectionCard } from "./sectionCard";

describe("<Section>", () => {
    it("supports className", () => {
        const { container } = render(<Section className="foo" />);
        const section = container.querySelector(`.${Classes.SECTION}`);
        expect(section).not.toBeNull();
        expect(section!).toHaveClass("foo");
    });

    it("supports icon", () => {
        const { container } = render(<Section icon={IconNames.GRAPH} title="title" />);
        expect(container.querySelector(`[data-icon="${IconNames.GRAPH}"]`)).toBeInTheDocument();
    });

    it("renders optional title element", () => {
        render(<Section title="title" />);
        const title = screen.getByRole("heading", { name: "title" });
        expect(title.tagName.toLowerCase()).toBe("h6");
    });

    it("renders optional sub-title element", () => {
        render(<Section title="title" subtitle="subtitle" />);
        const subtitle = screen.getByText("subtitle");
        expect(subtitle).toHaveClass(Classes.SECTION_HEADER_SUB_TITLE);
    });

    it("renders custom title element with titleRenderer", () => {
        render(<Section title="title" titleRenderer={H5} />);
        const title = screen.getByRole("heading", { name: "title" });
        expect(title.tagName.toLowerCase()).toBe("h5");
    });

    it("keeps section and title ids stable across re-renders", () => {
        const { container, rerender } = render(<Section title="title" />);
        const section = container.querySelector(`.${Classes.SECTION}`)!;
        const sectionId = section.getAttribute("id");
        const titleId = screen.getByRole("heading", { name: "title" }).getAttribute("id");
        expect(sectionId).not.toBeNull();
        expect(titleId).not.toBeNull();
        expect(section.getAttribute("aria-labelledby")).toBe(titleId);

        rerender(<Section title="title" subtitle="subtitle" />);
        expect(section.getAttribute("id")).toBe(sectionId);
        expect(screen.getByRole("heading", { name: "title" }).getAttribute("id")).toBe(titleId);
    });

    it("generates distinct ids for sibling sections", () => {
        const { container } = render(
            <>
                <Section title="first" />
                <Section title="second" />
            </>,
        );
        const [first, second] = Array.from(container.querySelectorAll(`.${Classes.SECTION}`));
        expect(first.getAttribute("id")).not.toBe(second.getAttribute("id"));
    });

    it("collapse toggle aria-controls matches the section id", () => {
        const { container } = render(
            <Section collapsible={true} title="Test">
                <SectionCard>content</SectionCard>
            </Section>,
        );
        const section = container.querySelector(`.${Classes.SECTION}`)!;
        const toggle = screen.getByRole("button", { name: "collapse section" });
        expect(toggle.getAttribute("aria-controls")).toBe(section.getAttribute("id"));
    });

    describe("uncontrolled collapse mode", () => {
        it("collapsible is open when defaultIsOpen={undefined}", () => {
            render(
                <Section collapsible={true} collapseProps={{ defaultIsOpen: undefined }} title="Test">
                    <SectionCard>is open</SectionCard>
                </Section>,
            );
            const button = screen.getByRole("button", { name: "collapse section" });
            expect(button).toHaveAttribute("aria-expanded", "false");
            expect(screen.getByText("is open")).toBeVisible();
        });

        it("collapsible is open when defaultIsOpen={true}", () => {
            render(
                <Section collapsible={true} collapseProps={{ defaultIsOpen: true }} title="Test">
                    <SectionCard>is open</SectionCard>
                </Section>,
            );
            const button = screen.getByRole("button", { name: "collapse section" });
            expect(button).toHaveAttribute("aria-expanded", "false");
            expect(screen.getByText("is open")).toBeVisible();
        });

        it("collapsible is closed when defaultIsOpen={false}", () => {
            render(
                <Section collapsible={true} collapseProps={{ defaultIsOpen: false }} title="Test">
                    <SectionCard>is closed</SectionCard>
                </Section>,
            );
            const button = screen.getByRole("button", { name: "expand section" });
            expect(button).toHaveAttribute("aria-expanded", "true");
            expect(screen.queryByText("is closed")).not.toBeInTheDocument();
        });
    });

    describe("controlled collapse mode", () => {
        it("collapsible is open when isOpen={true}", () => {
            render(
                <Section collapsible={true} collapseProps={{ isOpen: true }} title="Test">
                    <SectionCard>is open</SectionCard>
                </Section>,
            );
            const button = screen.getByRole("button", { name: "collapse section" });
            expect(button).toHaveAttribute("aria-expanded", "false");
            expect(screen.getByText("is open")).toBeVisible();
        });

        it("collapsible is closed when isOpen={false}", () => {
            render(
                <Section collapsible={true} collapseProps={{ isOpen: false }} title="Test">
                    <SectionCard>is closed</SectionCard>
                </Section>,
            );
            const button = screen.getByRole("button", { name: "expand section" });
            expect(button).toHaveAttribute("aria-expanded", "true");
            expect(screen.queryByText("is closed")).not.toBeInTheDocument();
        });
    });
});
