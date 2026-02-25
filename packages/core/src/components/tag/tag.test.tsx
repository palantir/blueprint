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
import { Text } from "../text/text";

import { Tag } from "./tag";

describe("<Tag>", () => {
    it("renders its text", () => {
        expect(
            shallow(<Tag>Hello</Tag>)
                .find(Text)
                .prop("children"),
        ).toBe("Hello");
    });

    it("text is not rendered if omitted", () => {
        expect(
            shallow(<Tag icon="tick" />)
                .find(Text)
                .exists(),
        ).toBe(false);
    });

    it("renders icons", () => {
        const wrapper = shallow(<Tag icon="tick" endIcon="airplane" />);
        expect(wrapper.find(Icon)).toHaveLength(2);
    });

    it("prefers endIcon to rightIcon", () => {
        const endIcon = <Icon icon="airplane" data-testid="endIcon" />;
        const rightIcon = <Icon icon="tick" data-testid="rightIcon" />;
        render(
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            <Tag endIcon={endIcon} rightIcon={rightIcon} />,
        );
        expect(screen.getByTestId("endIcon")).to.exist;
        expect(screen.queryByTestId("rightIcon")).not.toBeInTheDocument();
    });

    it("renders close button when onRemove is a function", () => {
        const wrapper = mount(<Tag onRemove={vi.fn()}>Hello</Tag>);
        expect(wrapper.find(`.${Classes.TAG_REMOVE}`)).toHaveLength(1);
    });

    it("clicking close button triggers onRemove", () => {
        const handleRemove = vi.fn();
        mount(<Tag onRemove={handleRemove}>Hello</Tag>)
            .find(`.${Classes.TAG_REMOVE}`)
            .simulate("click");
        expect(handleRemove).toHaveBeenCalledOnce();
    });

    it("should be interactive when onClick is provided", () => {
        const wrapper = mount(<Tag onClick={vi.fn()}>Hello</Tag>);
        expect(wrapper.find(`.${Classes.INTERACTIVE}`)).toHaveLength(1);
    });

    it("should not be interactive when interactive={false}", () => {
        const wrapper = mount(
            <Tag onClick={vi.fn()} interactive={false}>
                Hello
            </Tag>,
        );
        expect(wrapper.find(`.${Classes.INTERACTIVE}`)).toHaveLength(0);
    });

    it(`passes other props onto .${Classes.TAG} element`, () => {
        const element = shallow(<Tag title="baz qux">Hello</Tag>).find("." + Classes.TAG);
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
        mount(<Tag {...tagProps}>Hello</Tag>)
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
        const wrapper = mount(<Tag ref={elementRef}>Hello</Tag>);

        // wait for the whole lifecycle to run
        await waitFor(() => {
            expect(elementRef.current).toBe(wrapper.find(`.${Classes.TAG}`).getDOMNode<HTMLSpanElement>());
        });
    });
});
