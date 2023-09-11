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

import * as React from "react";

import { Classes, DatePickerUtils } from "@blueprintjs/datetime";
import { IconSize } from "@blueprintjs/icons";

export function useMonthSelectRightOffset(
    monthSelectElement: React.RefObject<HTMLSelectElement>,
    containerElement: React.RefObject<HTMLElement>,
    displayedMonthText: string,
): number {
    const [monthRightOffset, setMonthRightOffset] = React.useState<number>(0);

    React.useLayoutEffect(() => {
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
    }, [containerElement, displayedMonthText, monthSelectElement]);

    return monthRightOffset;
}
