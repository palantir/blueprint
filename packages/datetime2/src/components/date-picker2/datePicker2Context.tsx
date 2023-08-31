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

import type { DatePicker2Props } from "./datePicker2Props";
import type { DatePicker2State } from "./datePicker2State";

export type DatePicker2ContextState = DatePicker2Props & Pick<DatePicker2State, "locale">;

/**
 * Context used to pass DatePicker2 props and state down to custom react-day-picker components like
 * DatePicker2Caption.
 */
export const DatePicker2Context = React.createContext<DatePicker2ContextState>({
    locale: undefined,
});

export const DatePicker2Provider = (props: React.PropsWithChildren<DatePicker2ContextState>) => {
    return <DatePicker2Context.Provider value={props}>{props.children}</DatePicker2Context.Provider>
}
