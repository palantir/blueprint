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

import { render, within } from "@testing-library/react";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Menu } from "./menu";
import { MenuDivider } from "./menuDivider";
import { MenuItem } from "./menuItem";

describe("<MenuDivider>", () => {
    it("React renders MenuDivider", () => {
        const { container } = render(<MenuDivider />);
        const divider = container.querySelector("li")!;
        expect(divider).toHaveClass(Classes.MENU_DIVIDER);
        expect(divider).not.toHaveClass(Classes.MENU_HEADER);
        expect(divider.querySelector("h6")).not.toBeInTheDocument();
    });

    it("React renders MenuDivider with title", () => {
        const { container } = render(<MenuDivider title="Subject" />);
        const divider = container.querySelector("li")!;
        expect(divider).not.toHaveClass(Classes.MENU_DIVIDER);
        expect(divider).toHaveClass(Classes.MENU_HEADER);
        expect(divider.querySelector("h6")).toBeInTheDocument();
    });
});

describe("<Menu>", () => {
    it("React renders Menu with children", () => {
        const { container } = render(
            <Menu>
                <MenuItem icon="graph" text="Graph" />
            </Menu>,
        );
        const menu = container.querySelector(`.${Classes.MENU}`)!;
        expect(menu).toBeInTheDocument();
        expect(within(menu as HTMLElement).getAllByRole("menuitem")).toHaveLength(1);
    });
});
