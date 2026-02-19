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

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Menu } from "./menu";
import { MenuDivider } from "./menuDivider";
import { MenuItem } from "./menuItem";

describe("<MenuDivider>", () => {
    it("renders MenuDivider", () => {
        render(<MenuDivider />);

        const divider = screen.getByRole("separator");
        expect(divider).toHaveClass(Classes.MENU_DIVIDER);
        expect(divider).not.toHaveClass(Classes.MENU_HEADER);
    });

    it("renders MenuDivider with title", () => {
        render(<MenuDivider title="Subject" />);

        const divider = screen.getByRole("separator");
        expect(divider).not.toHaveClass(Classes.MENU_DIVIDER);
        expect(divider).toHaveClass(Classes.MENU_HEADER);

        const title = screen.getByText("Subject");
        expect(title.tagName.toLowerCase()).toBe("h6");
    });
});

describe("<Menu>", () => {
    it("renders Menu with children", () => {
        render(
            <Menu>
                <MenuItem icon="graph" text="Graph" />
            </Menu>,
        );

        expect(screen.getByRole("menu")).toHaveClass(Classes.MENU);
        expect(screen.getByRole("menuitem", { name: "Graph" })).toBeInTheDocument();
    });
});
