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

import { createContext } from "react";

import type { DatePickerBaseProps } from "../../common";

import type { DatePickerState } from "./datePickerState";

export type DatePickerContextState = Pick<DatePickerBaseProps, "reverseMonthAndYearMenus"> &
    Pick<DatePickerState, "locale">;

/**
 * Context used to pass DatePicker & DateRangePicker props and state down to custom react-day-picker components
 * like DatePickerCaption.
 */
export const DatePickerContext = createContext<DatePickerContextState>({
    locale: undefined,
});

export const DatePickerProvider = (props: React.PropsWithChildren<DatePickerContextState>) => {
    return <DatePickerContext.Provider value={props}>{props.children}</DatePickerContext.Provider>;
};
