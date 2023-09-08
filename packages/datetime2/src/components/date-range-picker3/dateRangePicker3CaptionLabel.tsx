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

import { format } from "date-fns";
import * as React from "react";
import { CaptionLabelProps } from "react-day-picker";
import { DatePicker3Context } from "../date-picker3/datePicker3Context";
import { DoubleCaretVertical } from "@blueprintjs/icons";

/**
 * Custom react-day-picker caption label component which implements Blueprint's datepicker design.
 */
export function DateRangePicker3CaptionLabel(props: CaptionLabelProps) {
    const { locale } = React.useContext(DatePicker3Context);
    const displayMonth = props.displayMonth.getMonth();
    const displayYear = props.displayMonth.getFullYear();
    const monthLabel = format(new Date(displayYear, displayMonth), "MMMM", { locale });

    return (
        <div>
            <span id={props.id}>
                <strong>{monthLabel}</strong>
            </span>
            <DoubleCaretVertical />
        </div>
    );
}
