/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { describe, expect, it } from "vitest";

import {
    AddIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BanCircleIcon,
    CircleArrowDownIcon,
    CircleArrowUpIcon,
    CircleExclamationIcon,
    CircleIcon,
    CircleMinusIcon,
    CirclePlusIcon,
    CircleXIcon,
    ColumnArrowLeftIcon,
    ColumnArrowRightIcon,
    CrossCircleIcon,
    DownloadIcon,
    DrawerLeftFilledIcon,
    DrawerRightFilledIcon,
    EarthIcon,
    ErrorIcon,
    FullCircleIcon,
    GlobeIcon,
    HomeIcon,
    HouseIcon,
    ModalIcon,
    TextAlignLeftIcon,
    TextAlignRightIcon,
    UploadIcon,
    UserCircleIcon,
    UserIcon,
    WindowIcon,
} from "./generated";

describe("@blueprintjs/icons/next legacy aliases", () => {
    it("aliases a legacy name to its next-generation component", () => {
        expect(AddIcon).toBe(CirclePlusIcon);
        expect(HomeIcon).toBe(HouseIcon);
    });

    it("maps every legacy name to the outlined next component (default style)", () => {
        expect(BanCircleIcon).toBe(CircleMinusIcon);
        expect(CrossCircleIcon).toBe(CircleXIcon);
        expect(DownloadIcon).toBe(CircleArrowDownIcon);
        expect(DrawerLeftFilledIcon).toBe(ColumnArrowRightIcon);
        expect(DrawerRightFilledIcon).toBe(ColumnArrowLeftIcon);
        expect(ErrorIcon).toBe(CircleExclamationIcon);
        expect(FullCircleIcon).toBe(CircleIcon);
        expect(ModalIcon).toBe(WindowIcon);
        expect(UploadIcon).toBe(CircleArrowUpIcon);
    });

    it("lets the next canonical icon win for colliding names", () => {
        expect(AlignLeftIcon).not.toBe(TextAlignLeftIcon);
        expect(AlignRightIcon).not.toBe(TextAlignRightIcon);
        expect(GlobeIcon).not.toBe(EarthIcon);
        expect(UserIcon).not.toBe(UserCircleIcon);
    });
});
