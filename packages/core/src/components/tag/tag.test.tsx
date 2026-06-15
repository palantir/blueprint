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
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { Icon } from "../icon/icon";

import { Tag } from "./tag";

describe("<Tag>", () => {
    it("renders its text", () => {
        render(<Tag>Hello</Tag>);
        expect(screen.getByText("Hello")).toBeInTheDocument();
    });

    it("text is not rendered if omitted", () => {
        const { container } = render(<Tag icon="tick" />);
        expect(container.querySelector(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`)).not.toBeInTheDocument();
    });

    it("renders icons", () => {
        const { container } = render(<Tag icon="tick" endIcon="airplane" />);
        const icons = container.querySelectorAll(`.${Classes.ICON}`);
        expect(icons).toHaveLength(2);
        expect(icons[0].firstChild).toBeInstanceOf(SVGElement);
        expect(icons[0].firstChild).toHaveAttribute("data-icon", "tick");
        expect(icons[1]).toHaveAttribute("data-icon", "airplane");
    });

    it("prefers endIcon to rightIcon", () => {
        const endIcon = <Icon icon="airplane" data-testid="endIcon" />;
        const rightIcon = <Icon icon="tick" data-testid="rightIcon" />;
        render(
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            <Tag endIcon={endIcon} rightIcon={rightIcon} />,
        );
        expect(screen.getByTestId("endIcon")).toBeInTheDocument();
        expect(screen.queryByTestId("rightIcon")).not.toBeInTheDocument();
    });

    it("renders close button when onRemove is a function", () => {
        render(<Tag onRemove={vi.fn()}>Hello</Tag>);
        const closeButton = screen.getByRole("button", { name: "Remove tag" });
        expect(closeButton).toHaveClass(Classes.TAG_REMOVE);
    });

    it("clicking close button triggers onRemove", async () => {
        const user = userEvent.setup();
        const handleRemove = vi.fn();
        render(<Tag onRemove={handleRemove}>Hello</Tag>);
        const closeButton = screen.getByRole("button", { name: "Remove tag" });
        await user.click(closeButton);
        expect(handleRemove).toHaveBeenCalledOnce();
    });

    it("should be interactive when onClick is provided", () => {
        render(<Tag onClick={vi.fn()}>Hello</Tag>);
        const button = screen.getByRole("button", { name: "Hello" });
        expect(button).toHaveClass(Classes.INTERACTIVE);
    });

    it("should not be interactive when interactive={false}", () => {
        render(
            <Tag onClick={vi.fn()} interactive={false}>
                Hello
            </Tag>,
        );
        const tag = screen.getByText("Hello").closest(`.${Classes.TAG}`);
        expect(tag).not.toHaveClass(Classes.INTERACTIVE);
        expect(tag).not.toHaveRole("button");
    });

    it(`passes other props onto .${Classes.TAG} element`, () => {
        render(<Tag title="baz qux">Hello</Tag>);
        const title = screen.getByTitle("baz qux");
        expect(title).toHaveClass(Classes.TAG);
        expect(title).toHaveTextContent("Hello");
    });

    it("passes all props to the onRemove handler", async () => {
        const user = userEvent.setup();
        const handleRemove = vi.fn();
        const DATA_ATTR_FOO = "data-foo";
        const tagProps = {
            [DATA_ATTR_FOO]: {
                bar: "baz",
                foo: 5,
            },
            onRemove: handleRemove,
        };
        render(<Tag {...tagProps}>Hello</Tag>);
        await user.click(screen.getByRole("button", { name: "Remove tag" }));
        expect(handleRemove).toHaveBeenCalledOnce();
        expect(handleRemove).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ [DATA_ATTR_FOO]: tagProps[DATA_ATTR_FOO] }),
        );
    });

    it("supports ref objects", () => {
        const elementRef = createRef<HTMLSpanElement>();
        render(<Tag ref={elementRef}>Hello</Tag>);
        expect(elementRef.current).toHaveClass(Classes.TAG);
    });
});
