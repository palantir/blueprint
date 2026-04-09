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

import { CompoundTag } from "./compoundTag";

describe("<CompoundTag>", () => {
    it("renders its text", () => {
        render(<CompoundTag leftContent="Hello">World</CompoundTag>);
        expect(screen.getByText("Hello")).toBeInTheDocument();
        expect(screen.getByText("World")).toBeInTheDocument();
    });

    it("renders icons", () => {
        const { container } = render(
            <CompoundTag icon="tick" endIcon="airplane" leftContent="Hello">
                World
            </CompoundTag>,
        );
        const icons = container.querySelectorAll(`.${Classes.ICON}`);
        expect(icons).toHaveLength(2);
        expect(icons[0]).toHaveAttribute("data-icon", "tick");
        expect(icons[1]).toHaveAttribute("data-icon", "airplane");
    });

    it("prefers endIcon to rightIcon", () => {
        const endIcon = <Icon icon="airplane" data-testid="endIcon" />;
        const rightIcon = <Icon icon="add" data-testid="rightIcon" />;
        render(
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            <CompoundTag endIcon={endIcon} rightIcon={rightIcon} leftContent="Hello">
                World
            </CompoundTag>,
        );
        expect(screen.getByTestId("endIcon")).toBeInTheDocument();
        expect(screen.queryByTestId("rightIcon")).not.toBeInTheDocument();
    });

    it("renders close button when onRemove is a function", () => {
        render(
            <CompoundTag onRemove={vi.fn()} leftContent="Hello">
                World
            </CompoundTag>,
        );
        const closeButton = screen.getByRole("button", { name: "Remove tag" });
        expect(closeButton).toHaveClass(Classes.TAG_REMOVE);
    });

    it("clicking close button triggers onRemove", async () => {
        const user = userEvent.setup();
        const handleRemove = vi.fn();
        render(
            <CompoundTag onRemove={handleRemove} leftContent="Hello">
                World
            </CompoundTag>,
        );
        await user.click(screen.getByRole("button", { name: "Remove tag" }));
        expect(handleRemove).toHaveBeenCalledOnce();
    });

    it(`passes other props onto .${Classes.COMPOUND_TAG} element`, () => {
        render(
            <CompoundTag title="baz qux" leftContent="Hello">
                World
            </CompoundTag>,
        );
        const element = screen.getByTitle("baz qux");
        expect(element).toHaveClass(Classes.COMPOUND_TAG);
        expect(element).toHaveTextContent("World");
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
        render(
            <CompoundTag {...tagProps} leftContent="Hello">
                World
            </CompoundTag>,
        );
        await user.click(screen.getByRole("button", { name: "Remove tag" }));
        expect(handleRemove).toHaveBeenCalledOnce();
        expect(handleRemove).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ [DATA_ATTR_FOO]: tagProps[DATA_ATTR_FOO] }),
        );
    });

    it("supports ref objects", () => {
        const elementRef = createRef<HTMLSpanElement>();
        render(
            <CompoundTag ref={elementRef} leftContent="Hello">
                World
            </CompoundTag>,
        );
        expect(elementRef.current).toHaveClass(Classes.TAG);
    });
});
