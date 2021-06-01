/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

export interface Popover2ContextState {
    forceDisabled?: boolean;
}

type Popover2Action = { type: "FORCE_DISABLED_STATE" } | { type: "RESET_DISABLED_STATE" };
const noOpDispatch: React.Dispatch<Popover2Action> = () => null;

export const Popover2Context = React.createContext<[Popover2ContextState, React.Dispatch<Popover2Action>]>([
    {},
    noOpDispatch,
]);

const popover2Reducer = (state: Popover2ContextState, action: Popover2Action) => {
    switch (action.type) {
        case "FORCE_DISABLED_STATE":
            return { forceDisabled: true };
        case "RESET_DISABLED_STATE":
            return {};
        default:
            return state;
    }
};

interface Popover2ProviderProps {
    children: React.ReactNode | ((ctxState: Popover2ContextState) => React.ReactNode);
    initialState?: Partial<Popover2ContextState>;
}

export const Popover2Provider = ({ children, initialState = {} }: Popover2ProviderProps) => {
    const [state, dispatch] = React.useReducer(popover2Reducer, initialState);
    return (
        <Popover2Context.Provider value={[state, dispatch]}>
            {typeof children === "function" ? children(state) : children}
        </Popover2Context.Provider>
    );
};
