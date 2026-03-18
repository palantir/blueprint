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

import { fireEvent, render } from "@testing-library/react";
import { createRef } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";
import { assertElement } from "@blueprintjs/test-commons/vitest-utils";

import { Classes } from "../../common";
import { Icon } from "../icon/icon";

import { CompoundTag } from "./compoundTag";

describe("<CompoundTag>", () => {
    it("renders its text", () => {
        const { container } = render(<CompoundTag leftContent="Hello">World</CompoundTag>);
        expect(container.querySelector(`.${Classes.COMPOUND_TAG_RIGHT_CONTENT}`)).toHaveTextContent("World");
    });

    it("renders icons", () => {
        const { container } = render(
            <CompoundTag icon="tick" endIcon="airplane" leftContent="Hello">
                World
            </CompoundTag>,
        );
        expect(container.querySelectorAll(`.${Classes.ICON}`)).toHaveLength(2);
    });

    it("prefers endIcon to rightIcon", () => {
        const endIcon = <Icon icon="airplane" data-testid="endIcon" />;
        const rightIcon = <Icon icon="add" data-testid="rightIcon" />;
        const { container } = render(
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            <CompoundTag endIcon={endIcon} rightIcon={rightIcon} leftContent="Hello">
                World
            </CompoundTag>,
        );
        expect(container.querySelector('[data-testid="endIcon"]')).toBeInTheDocument();
        expect(container.querySelector('[data-testid="rightIcon"]')).not.toBeInTheDocument();
    });

    it("renders close button when onRemove is a function", () => {
        const { container } = render(
            <CompoundTag onRemove={vi.fn()} leftContent="Hello">
                World
            </CompoundTag>,
        );
        expect(container.querySelectorAll(`.${Classes.TAG_REMOVE}`)).toHaveLength(1);
    });

    it("clicking close button triggers onRemove", () => {
        const handleRemove = vi.fn();
        const { container } = render(
            <CompoundTag onRemove={handleRemove} leftContent="Hello">
                World
            </CompoundTag>,
        );
        const removeButton = assertElement(container, `.${Classes.TAG_REMOVE}`);
        fireEvent.click(removeButton);
        expect(handleRemove).toHaveBeenCalledOnce();
    });

    it(`passes other props onto .${Classes.COMPOUND_TAG} element`, () => {
        const { container } = render(
            <CompoundTag title="baz qux" leftContent="Hello">
                World
            </CompoundTag>,
        );
        const element = assertElement(container, `.${Classes.COMPOUND_TAG}`);
        expect(element).toHaveAttribute("title", "baz qux");
    });

    it("passes all props to the onRemove handler", () => {
        const handleRemove = vi.fn();
        const DATA_ATTR_FOO = "data-foo";
        const tagProps = {
            [DATA_ATTR_FOO]: {
                bar: "baz",
                foo: 5,
            },
            onRemove: handleRemove,
        };
        const { container } = render(
            <CompoundTag {...tagProps} leftContent="Hello">
                World
            </CompoundTag>,
        );
        const removeButton = assertElement(container, `.${Classes.TAG_REMOVE}`);
        fireEvent.click(removeButton);
        expect(handleRemove).toHaveBeenCalledOnce();
        expect(handleRemove).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ [DATA_ATTR_FOO]: tagProps[DATA_ATTR_FOO] }),
        );
    });

    it("supports ref objects", () => {
        const elementRef = createRef<HTMLSpanElement>();
        const { container } = render(
            <CompoundTag ref={elementRef} leftContent="Hello">
                World
            </CompoundTag>,
        );
        expect(elementRef.current).toBe(container.querySelector(`.${Classes.TAG}`));
    });
});
