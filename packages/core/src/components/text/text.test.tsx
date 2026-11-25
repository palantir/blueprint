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

import { render, screen } from "@testing-library/react";

import { afterEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

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
            let scrollWidth = 50;

            afterEach(() => {
                vi.restoreAllMocks();
                scrollWidth = 50;
            });

            const mockOverflow = (isOverflowing: boolean) => {
                scrollWidth = isOverflowing ? 200 : 50;
                vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(() => scrollWidth);
                vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(50);
            };

            it("adds the title attribute when text overflows", () => {
                mockOverflow(true);
                render(<Text ellipsize={true}>Foo</Text>);
                expect(screen.getByText("Foo")).toHaveAttribute("title", "Foo");
            });

            it("does not add the title attribute when text does not overflow", () => {
                mockOverflow(false);
                render(<Text ellipsize={true}>Foo</Text>);
                expect(screen.getByText("Foo")).not.toHaveAttribute("title");
            });

            it("uses given title even if text overflows", () => {
                mockOverflow(true);
                render(
                    <Text ellipsize={true} title="Test title">
                        Foo
                    </Text>,
                );
                expect(screen.getByTitle("Test title")).toBeInTheDocument();
            });

            it("clears the auto title when content no longer overflows", () => {
                mockOverflow(true);
                const { container, rerender } = render(
                    <Text ellipsize={true}>
                        <span>Foo</span>
                    </Text>,
                );
                let element = container.querySelector(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
                expect(element).not.toBeNull();
                expect(element!).toHaveAttribute("title", "Foo");

                mockOverflow(false);
                rerender(
                    <Text ellipsize={true}>
                        <span>Foo</span>
                    </Text>,
                );
                element = container.querySelector(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
                expect(element).not.toBeNull();
                expect(element!).not.toHaveAttribute("title");
            });

            it("does not nest updates when children identity changes", () => {
                mockOverflow(true);
                const { container, rerender } = render(
                    <Text ellipsize={true}>
                        <span>Foo</span>
                    </Text>,
                );
                const element = container.querySelector(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
                expect(element).not.toBeNull();
                expect(element!).toHaveAttribute("title", "Foo");

                for (let i = 0; i < 50; i++) {
                    rerender(
                        <Text ellipsize={true}>
                            <span>Foo</span>
                        </Text>,
                    );
                }

                expect(container.querySelector(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`)).toHaveAttribute("title", "Foo");
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
