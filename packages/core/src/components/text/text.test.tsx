/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { fireEvent, render, screen } from "@testing-library/react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Text } from "./text";

describe("<Text>", () => {
    it("adds the className prop", () => {
        const CLASS_NAME = "test-class";
        render(<Text className={CLASS_NAME}>Foo</Text>);
        const element = screen.getByText("Foo");
        expect(element).toHaveClass(CLASS_NAME);
    });

    it("uses given title", () => {
        render(<Text title="Bar">Foo</Text>);
        expect(screen.getByTitle("Bar")).toHaveTextContent("Foo");
    });

    describe("if ellipsize true", () => {
        it("truncates string children", () => {
            render(<Text ellipsize={true}>Foo</Text>);
            expect(screen.getByText("Foo")).toHaveClass(Classes.TEXT_OVERFLOW_ELLIPSIS);
        });

        it("truncates jsx children", () => {
            const { container } = render(
                <Text ellipsize={true}>
                    <span>
                        {"computed text "}
                        <span>text in a span</span>
                    </span>
                </Text>,
            );
            const element = container.querySelector(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
            expect(element).toBeInTheDocument();
            expect(element!).toHaveTextContent("computed text text in a span");
        });

        describe("title behavior", () => {
            // jsdom doesn't do layout, so stub the measurements the component reads on hover
            function mockOverflow(element: HTMLElement, isOverflowing: boolean) {
                Object.defineProperty(element, "clientWidth", { configurable: true, value: 100 });
                Object.defineProperty(element, "scrollWidth", { configurable: true, value: isOverflowing ? 200 : 100 });
            }

            it("adds the title attribute on hover when text overflows", () => {
                const textContent = new Array(100).join("this will overflow ");
                render(<Text ellipsize={true}>{textContent}</Text>);
                const element = screen.getByText(textContent.trim());
                mockOverflow(element, true);
                expect(element).not.toHaveAttribute("title");
                fireEvent.mouseEnter(element);
                expect(element).toHaveAttribute("title", textContent);
            });

            it("does not add the title attribute when text does not overflow", () => {
                render(<Text ellipsize={true}>Foo</Text>);
                const element = screen.getByText("Foo");
                mockOverflow(element, false);
                fireEvent.mouseEnter(element);
                expect(element).not.toHaveAttribute("title");
            });

            it("removes a stale title when text no longer overflows", () => {
                render(<Text ellipsize={true}>Foo</Text>);
                const element = screen.getByText("Foo");
                mockOverflow(element, true);
                fireEvent.mouseEnter(element);
                expect(element).toHaveAttribute("title", "Foo");
                mockOverflow(element, false);
                fireEvent.mouseEnter(element);
                expect(element).not.toHaveAttribute("title");
            });

            it("updates the title when children change while hovered", () => {
                const { rerender } = render(<Text ellipsize={true}>A much longer label</Text>);
                const element = screen.getByText("A much longer label");
                mockOverflow(element, true);
                fireEvent.mouseEnter(element);
                expect(element).toHaveAttribute("title", "A much longer label");

                mockOverflow(element, false);
                rerender(<Text ellipsize={true}>Short</Text>);
                expect(element).not.toHaveAttribute("title");

                mockOverflow(element, true);
                rerender(<Text ellipsize={true}>Another long label</Text>);
                expect(element).toHaveAttribute("title", "Another long label");
            });

            it("does not measure when children change while not hovered", () => {
                const { rerender } = render(<Text ellipsize={true}>Foo</Text>);
                const element = screen.getByText("Foo");
                mockOverflow(element, true);
                fireEvent.mouseEnter(element);
                fireEvent.mouseLeave(element);

                const scrollWidth = vi.fn(() => 100);
                Object.defineProperty(element, "scrollWidth", { configurable: true, get: scrollWidth });
                rerender(<Text ellipsize={true}>Bar</Text>);
                expect(scrollWidth).not.toHaveBeenCalled();
            });

            it("calls the onMouseLeave prop", () => {
                const onMouseLeave = vi.fn();
                render(
                    <Text ellipsize={true} onMouseLeave={onMouseLeave}>
                        Foo
                    </Text>,
                );
                fireEvent.mouseLeave(screen.getByText("Foo"));
                expect(onMouseLeave).toHaveBeenCalledTimes(1);
            });

            it("does not add the title attribute when ellipsize is false", () => {
                render(<Text>Foo</Text>);
                const element = screen.getByText("Foo");
                mockOverflow(element, true);
                fireEvent.mouseEnter(element);
                expect(element).not.toHaveAttribute("title");
            });

            it("uses given title even if text overflows", () => {
                const textContent = new Array(100).join("this will overflow ");
                render(
                    <Text ellipsize={true} title="Test title">
                        {textContent}
                    </Text>,
                );
                const element = screen.getByTitle("Test title");
                mockOverflow(element, true);
                fireEvent.mouseEnter(element);
                expect(element).toHaveAttribute("title", "Test title");
            });

            it("calls the onMouseEnter prop", () => {
                const onMouseEnter = vi.fn();
                render(
                    <Text ellipsize={true} onMouseEnter={onMouseEnter}>
                        Foo
                    </Text>,
                );
                fireEvent.mouseEnter(screen.getByText("Foo"));
                expect(onMouseEnter).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("if ellipsize false", () => {
        it("doesn't truncate string children", () => {
            render(<Text>Foo</Text>);
            expect(screen.getByText("Foo")).not.toHaveClass(Classes.TEXT_OVERFLOW_ELLIPSIS);
        });
    });
});
