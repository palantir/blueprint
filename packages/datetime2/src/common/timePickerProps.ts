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

import type { Props } from "@blueprintjs/core";

import type { TimePrecision } from "./timePrecision";
import type { TimeUnit } from "./timeUnit";

export interface TimePickerProps extends Props {
    /**
     * Whether to focus the first input when it opens initially.
     *
     * @default false
     */
    autoFocus?: boolean;

    /**
     * Initial time the `TimePicker` will display.
     * This should not be set if `value` is set.
     */
    defaultValue?: Date;

    /**
     * Whether the time picker is non-interactive.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Callback invoked on blur event emitted by specific time unit input
     */
    onBlur?: (event: React.FocusEvent<HTMLInputElement>, unit: TimeUnit) => void;

    /**
     * Callback invoked when the user changes the time.
     */
    onChange?: (newTime: Date) => void;

    /**
     * Callback invoked on focus event emitted by specific time unit input
     */
    onFocus?: (event: React.FocusEvent<HTMLInputElement>, unit: TimeUnit) => void;

    /**
     * Callback invoked on keydown event emitted by specific time unit input
     */
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>, unit: TimeUnit) => void;

    /**
     * Callback invoked on keyup event emitted by specific time unit input
     */
    onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>, unit: TimeUnit) => void;

    /**
     * The precision of time the user can set.
     *
     * @default TimePrecision.MINUTE
     */
    precision?: TimePrecision;

    /**
     * Whether all the text in each input should be selected on focus.
     *
     * @default false
     */
    selectAllOnFocus?: boolean;

    /**
     * Whether to show arrows buttons for changing the time.
     *
     * @default false
     */
    showArrowButtons?: boolean;

    /**
     * Whether to use a 12 hour format with an AM/PM dropdown.
     *
     * @default false
     */
    useAmPm?: boolean;

    /**
     * The latest time the user can select. The year, month, and day parts of the `Date` object are ignored.
     * While the `maxTime` will be later than the `minTime` in the basic case,
     * it is also allowed to be earlier than the `minTime`.
     * This is useful, for example, to express a time range that extends before and after midnight.
     * If the `maxTime` and `minTime` are equal, then the valid time range is constrained to only that one value.
     */
    maxTime?: Date;

    /**
     * The earliest time the user can select. The year, month, and day parts of the `Date` object are ignored.
     * While the `minTime` will be earlier than the `maxTime` in the basic case,
     * it is also allowed to be later than the `maxTime`.
     * This is useful, for example, to express a time range that extends before and after midnight.
     * If the `maxTime` and `minTime` are equal, then the valid time range is constrained to only that one value.
     */
    minTime?: Date;

    /**
     * The currently set time.
     * If this prop is provided, the component acts in a controlled manner.
     */
    value?: Date | null;
}
