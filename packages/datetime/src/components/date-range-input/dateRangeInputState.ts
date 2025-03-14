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

import type { Locale } from "date-fns";

import type { Boundary } from "@blueprintjs/core";

export interface DateRangeInput3State {
    isOpen?: boolean;
    boundaryToModify?: Boundary;
    lastFocusedField?: Boundary;
    locale?: Locale | undefined;

    formattedMinDateString?: string;
    formattedMaxDateString?: string;

    isStartInputFocused: boolean;
    isEndInputFocused: boolean;

    startInputString?: string;
    endInputString?: string;

    startHoverString?: string | null;
    endHoverString?: string | null;

    selectedEnd: Date | null;
    selectedStart: Date | null;

    shouldSelectAfterUpdate?: boolean;
    wasLastFocusChangeDueToHover?: boolean;

    selectedShortcutIndex?: number;
}
