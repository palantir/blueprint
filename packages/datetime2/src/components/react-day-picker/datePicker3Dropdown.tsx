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
import type { DropdownProps } from "react-day-picker";

import { HTMLSelect } from "@blueprintjs/core";

import { useMonthSelectRightOffset } from "../../common/useMonthSelectRightOffset";

/**
 * Custom react-day-picker dropdown component which implements Blueprint's datepicker design
 * for month and year dropdowns.
 *
 * @see https://react-day-picker.js.org/guides/custom-components
 */
export function DatePicker3Dropdown({ caption, children, ...props }: DropdownProps) {
    const containerElement = React.useRef<HTMLDivElement>(null);
    const selectElement = React.useRef<HTMLSelectElement>(null);

    // Use a custom hook to adjust the position of the position of the HTMLSelect icon to appear right next to
    // the month name. N.B. we expect props.caption to be a simple string representing the month name.
    const displayedMonthText = typeof caption === "string" ? caption : "";
    const monthSelectRightOffset = useMonthSelectRightOffset(selectElement, containerElement, displayedMonthText);
    const iconProps = React.useMemo(
        () => (props.name === "months" ? { style: { right: monthSelectRightOffset } } : {}),
        [props.name, monthSelectRightOffset],
    );

    return (
        <div ref={containerElement}>
            <HTMLSelect iconProps={iconProps} minimal={true} ref={selectElement} {...props}>
                {children}
            </HTMLSelect>
        </div>
    );
}
