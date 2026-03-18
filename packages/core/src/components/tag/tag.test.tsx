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

import { Tag } from "./tag";

describe("<Tag>", () => {
    it("renders its text", () => {
        const { container } = render(<Tag>Hello</Tag>);
        expect(container.querySelector(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`)).toHaveTextContent("Hello");
    });

    it("text is not rendered if omitted", () => {
        const { container } = render(<Tag icon="tick" />);
        expect(container.querySelector(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`)).not.toBeInTheDocument();
    });

    it("renders icons", () => {
        const { container } = render(<Tag icon="tick" endIcon="airplane" />);
        expect(container.querySelectorAll(`.${Classes.ICON}`)).toHaveLength(2);
    });

    it("prefers endIcon to rightIcon", () => {
        const endIcon = <Icon icon="airplane" data-testid="endIcon" />;
        const rightIcon = <Icon icon="tick" data-testid="rightIcon" />;
        const { container } = render(
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            <Tag endIcon={endIcon} rightIcon={rightIcon} />,
        );
        expect(container.querySelector('[data-testid="endIcon"]')).toBeInTheDocument();
        expect(container.querySelector('[data-testid="rightIcon"]')).not.toBeInTheDocument();
    });

    it("renders close button when onRemove is a function", () => {
        const { container } = render(<Tag onRemove={vi.fn()}>Hello</Tag>);
        expect(container.querySelectorAll(`.${Classes.TAG_REMOVE}`)).toHaveLength(1);
    });

    it("clicking close button triggers onRemove", () => {
        const handleRemove = vi.fn();
        const { container } = render(<Tag onRemove={handleRemove}>Hello</Tag>);
        const removeButton = assertElement(container, `.${Classes.TAG_REMOVE}`);
        fireEvent.click(removeButton);
        expect(handleRemove).toHaveBeenCalledOnce();
    });

    it("should be interactive when onClick is provided", () => {
        const { container } = render(<Tag onClick={vi.fn()}>Hello</Tag>);
        expect(container.querySelectorAll(`.${Classes.INTERACTIVE}`)).toHaveLength(1);
    });

    it("should not be interactive when interactive={false}", () => {
        const { container } = render(
            <Tag onClick={vi.fn()} interactive={false}>
                Hello
            </Tag>,
        );
        expect(container.querySelectorAll(`.${Classes.INTERACTIVE}`)).toHaveLength(0);
    });

    it(`passes other props onto .${Classes.TAG} element`, () => {
        const { container } = render(<Tag title="baz qux">Hello</Tag>);
        const element = assertElement(container, `.${Classes.TAG}`);
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
        const { container } = render(<Tag {...tagProps}>Hello</Tag>);
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
        const { container } = render(<Tag ref={elementRef}>Hello</Tag>);
        expect(elementRef.current).toBe(container.querySelector(`.${Classes.TAG}`));
    });
});
