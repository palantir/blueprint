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

import { Section } from "./section";
import { SectionCard } from "./sectionCard";

describe("<Section>", () => {
    const isOpenSelector = `[data-icon="${IconNames.CHEVRON_UP}"]`;
    const isClosedSelector = `[data-icon="${IconNames.CHEVRON_DOWN}"]`;

    const assertIsOpen = (container: HTMLElement) => {
        expect(container.querySelector(isOpenSelector)).toBeInTheDocument();
    };

    const assertIsClosed = (container: HTMLElement) => {
        expect(container.querySelector(isClosedSelector)).toBeInTheDocument();
    };

    it("supports className", () => {
        const { container } = render(<Section className="foo" />);
        const section = container.querySelector(`.${Classes.SECTION}`)!;
        expect(section).toBeInTheDocument();
        expect(section).toHaveClass("foo");
    });

    it("supports icon", () => {
        const { container } = render(<Section icon={IconNames.GRAPH} title="title" />);
        expect(container.querySelector(`[data-icon="${IconNames.GRAPH}"]`)).toBeInTheDocument();
    });

    it("renders optional title element", () => {
        const { container } = render(<Section title="title" />);
        expect(container.querySelector("h6")).toBeInTheDocument();
    });

    it("renders optional sub-title element", () => {
        const { container } = render(<Section title="title" subtitle="subtitle" />);
        expect(container.querySelector(`.${Classes.SECTION_HEADER_SUB_TITLE}`)).toBeInTheDocument();
    });

    it("renders custom title element with titleRenderer", () => {
        const { container } = render(<Section title="title" titleRenderer="h5" />);
        expect(container.querySelector("h5")).toBeInTheDocument();
    });

    describe("uncontrolled collapse mode", () => {
        it("collapsible is open when defaultIsOpen={undefined}", () => {
            const { container } = render(
                <Section collapsible={true} collapseProps={{ defaultIsOpen: undefined }} title="Test">
                    <SectionCard>is open</SectionCard>
                </Section>,
            );
            assertIsOpen(container);
        });

        it("collapsible is open when defaultIsOpen={true}", () => {
            const { container } = render(
                <Section collapsible={true} collapseProps={{ defaultIsOpen: true }} title="Test">
                    <SectionCard>is open</SectionCard>
                </Section>,
            );
            assertIsOpen(container);
        });

        it("collapsible is closed when defaultIsOpen={false}", () => {
            const { container } = render(
                <Section collapsible={true} collapseProps={{ defaultIsOpen: false }} title="Test">
                    <SectionCard>is closed</SectionCard>
                </Section>,
            );
            assertIsClosed(container);
        });
    });

    describe("controlled collapse mode", () => {
        it("collapsible is open when isOpen={true}", () => {
            const { container } = render(
                <Section collapsible={true} collapseProps={{ isOpen: true }} title="Test">
                    <SectionCard>is open</SectionCard>
                </Section>,
            );
            assertIsOpen(container);
        });

        it("collapsible is closed when isOpen={false}", () => {
            const { container } = render(
                <Section collapsible={true} collapseProps={{ isOpen: false }} title="Test">
                    <SectionCard>is closed</SectionCard>
                </Section>,
            );
            assertIsClosed(container);
        });
    });
});
