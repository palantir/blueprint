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

import { assert } from "chai";
import { mount, type ReactWrapper } from "enzyme";
import * as React from "react";

import { IconNames } from "@blueprintjs/icons";

import { Classes, H5, H6, Section, SectionCard } from "../../src";

describe("<Section>", () => {
    let containerElement: HTMLElement | undefined;

    const isOpenSelector = `[data-icon="${IconNames.CHEVRON_UP}"]`;
    const isClosedSelector = `[data-icon="${IconNames.CHEVRON_DOWN}"]`;

    const assertIsOpen = (wrapper: ReactWrapper) => {
        assert.isTrue(wrapper.find(isOpenSelector).exists());
    };

    const assertIsClosed = (wrapper: ReactWrapper) => {
        assert.isTrue(wrapper.find(isClosedSelector).exists());
    };

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });
    afterEach(() => {
        containerElement?.remove();
    });

    it("supports className", () => {
        const wrapper = mount(<Section className="foo" />, {
            attachTo: containerElement,
        });
        assert.isTrue(wrapper.find(`.${Classes.SECTION}`).hostNodes().exists());
        assert.isTrue(wrapper.find(`.foo`).hostNodes().exists());
    });

    it("supports icon", () => {
        const wrapper = mount(<Section icon={IconNames.GRAPH} title="title" />, {
            attachTo: containerElement,
        });
        assert.isTrue(wrapper.find(`[data-icon="${IconNames.GRAPH}"]`).exists());
    });

    it("renders optional title element", () => {
        const wrapper = mount(<Section title="title" />, {
            attachTo: containerElement,
        });
        assert.isTrue(wrapper.find(H6).exists());
    });

    it("renders optional sub-title element", () => {
        const wrapper = mount(<Section title="title" subtitle="subtitle" />, {
            attachTo: containerElement,
        });
        assert.isTrue(wrapper.find(`.${Classes.SECTION_HEADER_SUB_TITLE}`).hostNodes().exists());
    });

    it("renders custom title element with titleRenderer", () => {
        const wrapper = mount(<Section title="title" titleRenderer={H5} />, {
            attachTo: containerElement,
        });
        assert.isTrue(wrapper.find(H5).exists());
    });

    describe("uncontrolled collapse mode", () => {
        it("collapsible is open when defaultIsOpen={undefined}", () => {
            const wrapper = mount(
                <Section collapsible={true} collapseProps={{ defaultIsOpen: undefined }} title="Test">
                    <SectionCard>is open</SectionCard>
                </Section>,
                { attachTo: containerElement },
            );
            assertIsOpen(wrapper);
        });

        it("collapsible is open when defaultIsOpen={true}", () => {
            const wrapper = mount(
                <Section collapsible={true} collapseProps={{ defaultIsOpen: true }} title="Test">
                    <SectionCard>is open</SectionCard>
                </Section>,
                { attachTo: containerElement },
            );
            assertIsOpen(wrapper);
        });

        it("collapsible is closed when defaultIsOpen={false}", () => {
            const wrapper = mount(
                <Section collapsible={true} collapseProps={{ defaultIsOpen: false }} title="Test">
                    <SectionCard>is closed</SectionCard>
                </Section>,
                { attachTo: containerElement },
            );
            assertIsClosed(wrapper);
        });
    });

    describe("controlled collapse mode", () => {
        it("collapsible is open when isOpen={true}", () => {
            const wrapper = mount(
                <Section collapsible={true} collapseProps={{ isOpen: true }} title="Test">
                    <SectionCard>is open</SectionCard>
                </Section>,
                { attachTo: containerElement },
            );
            assertIsOpen(wrapper);
        });

        it("collapsible is closed when isOpen={false}", () => {
            const wrapper = mount(
                <Section collapsible={true} collapseProps={{ isOpen: false }} title="Test">
                    <SectionCard>is closed</SectionCard>
                </Section>,
                { attachTo: containerElement },
            );
            assertIsClosed(wrapper);
        });
    });
});
