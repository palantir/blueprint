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

import { render } from "@testing-library/react";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Menu } from "./menu";
import { MenuDivider } from "./menuDivider";
import { MenuItem } from "./menuItem";

describe("<MenuDivider>", () => {
    it("React renders MenuDivider", () => {
        const { container } = render(<MenuDivider />);
        const divider = container.firstElementChild!;
        expect(divider).toHaveClass(Classes.MENU_DIVIDER);
        expect(divider).not.toHaveClass(Classes.MENU_HEADER);
        expect(container.querySelector("h6")).toBeNull();
    });

    it("React renders MenuDivider with title", () => {
        const { container } = render(<MenuDivider title="Subject" />);
        const divider = container.firstElementChild!;
        expect(divider).not.toHaveClass(Classes.MENU_DIVIDER);
        expect(divider).toHaveClass(Classes.MENU_HEADER);
        expect(container.querySelector("h6")).not.toBeNull();
    });
});

describe("<Menu>", () => {
    it("React renders Menu with children", () => {
        const { container } = render(
            <Menu>
                <MenuItem icon="graph" text="Graph" />
            </Menu>,
        );
        const menu = container.firstElementChild!;
        expect(menu).toHaveClass(Classes.MENU);
        expect(menu.querySelectorAll(`.${Classes.MENU_ITEM}`)).toHaveLength(1);
    });
});
