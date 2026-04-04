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

import React, { useMemo, useRef } from "react";
import type { DropdownProps } from "react-day-picker";
import { useDayPicker, useNavigation } from "react-day-picker";

import { HTMLSelect } from "@blueprintjs/core";

import { useMonthSelectRightOffset } from "../../common/useMonthSelectRightOffset";

/**
 * Custom react-day-picker dropdown component which implements Blueprint's datepicker design
 * for month and year dropdowns.
 *
 * @see https://daypicker.dev/guides/custom-components
 */
export function DatePickerDropdown({ caption, children, ...props }: DropdownProps) {
    const containerElement = useRef<HTMLDivElement>(null);
    const selectElement = useRef<HTMLSelectElement>(null);
    const { fromDate, toDate } = useDayPicker();
    const { currentMonth } = useNavigation();

    // Use a custom hook to adjust the position of the position of the HTMLSelect icon to appear right next to
    // the month name. N.B. we expect props.caption to be a simple string representing the month name.
    const displayedMonthText = typeof caption === "string" ? caption : "";
    const monthSelectRightOffset = useMonthSelectRightOffset(selectElement, containerElement, displayedMonthText);
    const iconProps = useMemo(
        () => (props.name === "months" ? { style: { right: monthSelectRightOffset } } : {}),
        [props.name, monthSelectRightOffset],
    );

    // Filter month options to only show months within the fromDate/toDate range for the displayed year.
    // react-day-picker v8 passes all 12 months regardless of fromDate/toDate constraints (#6891).
    const filteredChildren = useMemo(() => {
        if (props.name !== "months" || !children) {
            return children;
        }
        const displayYear = currentMonth.getFullYear();
        const startMonth = fromDate != null && displayYear === fromDate.getFullYear() ? fromDate.getMonth() : 0;
        const endMonth = toDate != null && displayYear === toDate.getFullYear() ? toDate.getMonth() : 11;
        return React.Children.toArray(children).filter(child => {
            if (!React.isValidElement(child)) {
                return true;
            }
            const monthValue = Number((child as React.ReactElement<{ value: number }>).props.value);
            return !isNaN(monthValue) && monthValue >= startMonth && monthValue <= endMonth;
        });
    }, [children, props.name, currentMonth, fromDate, toDate]);

    return (
        <div ref={containerElement}>
            <HTMLSelect iconProps={iconProps} minimal={true} ref={selectElement} {...props}>
                {filteredChildren}
            </HTMLSelect>
        </div>
    );
}
