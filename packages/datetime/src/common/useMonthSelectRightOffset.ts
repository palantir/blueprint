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

import { type RefObject, useState } from "react";

import { useIsomorphicLayoutEffect } from "@blueprintjs/core";
import { IconSize } from "@blueprintjs/icons";

import { DatePickerUtils } from "../components/date-picker/datePickerUtils";

import { Classes } from ".";

/**
 * Measures how far from the right edge of the month select its dropdown icon should sit so that it appears right
 * next to the displayed month name.
 *
 * @param monthOptionsKey identifies the month options. The select is as wide as its widest option, so the offset
 * is measured again whenever the options change (for example when `minDate` and `maxDate` move into the same year).
 */
export function useMonthSelectRightOffset(
    monthSelectElement: RefObject<HTMLSelectElement>,
    containerElement: RefObject<HTMLElement>,
    displayedMonthText: string,
    monthOptionsKey?: string,
): number {
    const [monthRightOffset, setMonthRightOffset] = useState<number>(0);

    useIsomorphicLayoutEffect(() => {
        if (containerElement.current == null) {
            return;
        }

        // measure width of text as rendered inside our container element.
        const monthTextWidth = DatePickerUtils.measureTextWidth(
            displayedMonthText,
            Classes.DATEPICKER_CAPTION_MEASURE,
            containerElement.current,
        );
        const monthSelectWidth = monthSelectElement.current?.clientWidth ?? 0;
        const rightOffset = Math.max(2, monthSelectWidth - monthTextWidth - IconSize.STANDARD - 2);
        setMonthRightOffset(rightOffset);
    }, [containerElement, displayedMonthText, monthOptionsKey, monthSelectElement]);

    return monthRightOffset;
}
