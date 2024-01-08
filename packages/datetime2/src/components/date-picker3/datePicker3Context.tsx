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

import type { DatePickerBaseProps } from "@blueprintjs/datetime";

import type { DatePicker3State } from "./datePicker3State";

export type DatePicker3ContextState = Pick<DatePickerBaseProps, "reverseMonthAndYearMenus"> &
    Pick<DatePicker3State, "locale">;

/**
 * Context used to pass DatePicker3 & DateRangePicker3 props and state down to custom react-day-picker components
 * like DatePicker3Caption.
 */
export const DatePicker3Context = React.createContext<DatePicker3ContextState>({
    locale: undefined,
});

export const DatePicker3Provider = (props: React.PropsWithChildren<DatePicker3ContextState>) => {
    return <DatePicker3Context.Provider value={props}>{props.children}</DatePicker3Context.Provider>;
};
