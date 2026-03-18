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

import { render, screen, waitFor } from "@testing-library/react";
import { mount, shallow } from "enzyme";
import { createRef } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { Icon } from "../icon/icon";

import { CompoundTag } from "./compoundTag";

describe("<CompoundTag>", () => {
    it("renders its text", () => {
        expect(
            shallow(<CompoundTag leftContent="Hello">World</CompoundTag>)
                .find(`.${Classes.COMPOUND_TAG_RIGHT_CONTENT}`)
                .prop("children"),
        ).toBe("World");
    });

    it("renders icons", () => {
        const wrapper = shallow(
            <CompoundTag icon="tick" endIcon="airplane" leftContent="Hello">
                World
            </CompoundTag>,
        );
        expect(wrapper.find(Icon)).toHaveLength(2);
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
        expect(screen.getByTestId("endIcon")).to.exist;
        expect(screen.queryByTestId("rightIcon")).not.toBeInTheDocument();
    });

    it("renders close button when onRemove is a function", () => {
        const wrapper = mount(
            <CompoundTag onRemove={vi.fn()} leftContent="Hello">
                World
            </CompoundTag>,
        );
        expect(wrapper.find(`.${Classes.TAG_REMOVE}`)).toHaveLength(1);
    });

    it("clicking close button triggers onRemove", () => {
        const handleRemove = vi.fn();
        mount(
            <CompoundTag onRemove={handleRemove} leftContent="Hello">
                World
            </CompoundTag>,
        )
            .find(`.${Classes.TAG_REMOVE}`)
            .simulate("click");
        expect(handleRemove).toHaveBeenCalledOnce();
    });

    it(`passes other props onto .${Classes.COMPOUND_TAG} element`, () => {
        const element = mount(
            <CompoundTag title="baz qux" leftContent="Hello">
                World
            </CompoundTag>,
        ).find(`.${Classes.COMPOUND_TAG}`);
        expect(element.prop("title")).toEqual("baz qux");
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
        mount(
            <CompoundTag {...tagProps} leftContent="Hello">
                World
            </CompoundTag>,
        )
            .find(`.${Classes.TAG_REMOVE}`)
            .simulate("click");
        expect(handleRemove).toHaveBeenCalledOnce();
        expect(handleRemove).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ [DATA_ATTR_FOO]: tagProps[DATA_ATTR_FOO] }),
        );
    });

    it("supports ref objects", async () => {
        const elementRef = createRef<HTMLSpanElement>();
        const wrapper = mount(
            <CompoundTag ref={elementRef} leftContent="Hello">
                World
            </CompoundTag>,
        );

        // wait for the whole lifecycle to run
        await waitFor(() => {
            expect(elementRef.current).toBe(wrapper.find(`.${Classes.TAG}`).getDOMNode<HTMLSpanElement>());
        });
    });
});
