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

    it("names the section group after its title", () => {
        render(<Section title="Flights" />);
        expect(screen.getByRole("group", { name: "Flights" })).toBeInTheDocument();
    });

    it("does not add a role or label without a title", () => {
        const { container } = render(<Section />);
        expect(container.firstElementChild).not.toHaveAttribute("role");
        expect(container.firstElementChild).not.toHaveAttribute("aria-labelledby");
    });

    it("supports overriding the section role", () => {
        render(<Section role="region" title="Flights" />);
        expect(screen.getByRole("region", { name: "Flights" })).toBeInTheDocument();
        expect(screen.queryByRole("group")).not.toBeInTheDocument();
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

    it("points the collapse button at the collapsible content, even when collapsed", () => {
        const { rerender } = render(
            <Section collapsible={true} collapseProps={{ isOpen: false }} title="Flights">
                <SectionCard>content</SectionCard>
            </Section>,
        );
        const getControlled = () => document.getElementById(screen.getByRole("button").getAttribute("aria-controls")!);
        expect(getControlled()).toHaveClass(Classes.COLLAPSE);

        rerender(
            <Section collapsible={true} collapseProps={{ isOpen: true }} title="Flights">
                <SectionCard>content</SectionCard>
            </Section>,
        );
        expect(getControlled()).toContainElement(screen.getByText("content"));
        expect(getControlled()).not.toContainElement(screen.getByRole("button"));
    });

    describe("uncontrolled collapse mode", () => {
        it("collapsible is open when defaultIsOpen={undefined}", () => {
            render(
                <Section collapsible={true} collapseProps={{ defaultIsOpen: undefined }} title="Test">
                    <SectionCard>is open</SectionCard>
                </Section>,
            );
            const button = screen.getByRole("button", { name: "collapse section Test" });
            expect(button).toHaveAttribute("aria-expanded", "true");
            expect(screen.getByText("is open")).toBeVisible();
        });

        it("collapsible is open when defaultIsOpen={true}", () => {
            render(
                <Section collapsible={true} collapseProps={{ defaultIsOpen: true }} title="Test">
                    <SectionCard>is open</SectionCard>
                </Section>,
            );
            const button = screen.getByRole("button", { name: "collapse section Test" });
            expect(button).toHaveAttribute("aria-expanded", "true");
            expect(screen.getByText("is open")).toBeVisible();
        });

        it("collapsible is closed when defaultIsOpen={false}", () => {
            render(
                <Section collapsible={true} collapseProps={{ defaultIsOpen: false }} title="Test">
                    <SectionCard>is closed</SectionCard>
                </Section>,
            );
            const button = screen.getByRole("button", { name: "expand section Test" });
            expect(button).toHaveAttribute("aria-expanded", "false");
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
            const button = screen.getByRole("button", { name: "collapse section Test" });
            expect(button).toHaveAttribute("aria-expanded", "true");
            expect(screen.getByText("is open")).toBeVisible();
        });

        it("collapsible is closed when isOpen={false}", () => {
            render(
                <Section collapsible={true} collapseProps={{ isOpen: false }} title="Test">
                    <SectionCard>is closed</SectionCard>
                </Section>,
            );
            const button = screen.getByRole("button", { name: "expand section Test" });
            expect(button).toHaveAttribute("aria-expanded", "false");
            expect(screen.queryByText("is closed")).not.toBeInTheDocument();
        });
    });
});
