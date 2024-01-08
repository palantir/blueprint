/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { shallow } from "enzyme";
import * as React from "react";

import { Menu, MenuItem } from "@blueprintjs/core";

import type { ItemRenderer, ItemRendererProps } from "../src";
import { type Film, TOP_100_FILMS } from "../src/__examples__";

describe("ItemRenderer", () => {
    // N.B. don't use `renderFilm` here from the src/__examples__ directory, since we are specifically trying to
    // test the ergonomics and type definitions of the item renderer API by defining custom renderers.
    describe("allows defining basic item renderers", () => {
        const myItemRenderer: ItemRenderer<Film> = (item, { modifiers, handleClick, handleFocus, ref }) => {
            return (
                <MenuItem
                    active={modifiers.active}
                    key={item.title}
                    onClick={handleClick}
                    onFocus={handleFocus}
                    ref={ref}
                    text={item.title}
                />
            );
        };

        it("without ref prop", () => {
            function getItemProps(_item: Film, index: number): ItemRendererProps {
                return {
                    handleClick: (_event: React.MouseEvent<HTMLElement>) => {
                        /* noop */
                    },
                    index,
                    modifiers: {
                        active: false,
                        disabled: false,
                        matchesPredicate: true,
                    },
                    query: "",
                };
            }
            const MyList: React.FC = () => {
                return (
                    <Menu>{TOP_100_FILMS.map((item, index) => myItemRenderer(item, getItemProps(item, index)))}</Menu>
                );
            };
            shallow(<MyList />);
        });

        it("with ref prop", () => {
            function getItemProps(_item: Film): ItemRendererProps {
                const ref = React.createRef<HTMLLIElement>();
                return {
                    // @ts-expect-error -- extra properties should not be allowed
                    blah: "foo",
                    handleClick: (_event: React.MouseEvent<HTMLElement>) => {
                        /* noop */
                    },
                    modifiers: {
                        active: false,
                        disabled: false,
                        matchesPredicate: true,
                    },
                    query: "",
                    ref,
                };
            }
            const MyList: React.FC = () => {
                return <Menu>{TOP_100_FILMS.map(item => myItemRenderer(item, getItemProps(item)))}</Menu>;
            };
            shallow(<MyList />);
        });
    });
});
