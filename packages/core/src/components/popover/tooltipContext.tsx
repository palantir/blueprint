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

export interface TooltipContextState {
    forceDisabled?: boolean;
}

type TooltipAction = { type: "FORCE_DISABLED_STATE" } | { type: "RESET_DISABLED_STATE" };
const noOpDispatch: React.Dispatch<TooltipAction> = () => null;

export const TooltipContext = React.createContext<[TooltipContextState, React.Dispatch<TooltipAction>]>([
    {},
    noOpDispatch,
]);

const tooltipContextReducer = (state: TooltipContextState, action: TooltipAction) => {
    switch (action.type) {
        case "FORCE_DISABLED_STATE":
            return { forceDisabled: true };
        case "RESET_DISABLED_STATE":
            return {};
        default:
            return state;
    }
};

interface TooltipProviderProps {
    children: React.ReactNode | ((ctxState: TooltipContextState) => React.ReactNode);
    forceDisable?: boolean;
}

export const TooltipProvider = ({ children, forceDisable }: TooltipProviderProps) => {
    const [state, dispatch] = React.useReducer(tooltipContextReducer, {});

    React.useEffect(() => {
        if (forceDisable) {
            dispatch({ type: "FORCE_DISABLED_STATE" });
        } else {
            dispatch({ type: "RESET_DISABLED_STATE" });
        }
    }, [forceDisable]);

    return (
        <TooltipContext.Provider value={[state, dispatch]}>
            {typeof children === "function" ? children(state) : children}
        </TooltipContext.Provider>
    );
};
