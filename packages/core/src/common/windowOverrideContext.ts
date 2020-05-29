import { ValidationMap } from "prop-types";
import * as Errors from "./errors";

export interface IWindowOverrideContext {
    /** Use this window object for any global variable access. */
    windowOverride?: Window;
}

export const WINDOW_OVERRIDE_REACT_CONTEXT_TYPES: ValidationMap<IWindowOverrideContext> = {
    windowOverride: (obj: IWindowOverrideContext, key: keyof IWindowOverrideContext) => {
        const variable = obj[key];
        if (variable != null && (variable.document == null || variable.location == null || variable.alert == null || variable.setInterval == null)) {
            return new Error(Errors.WINDOW_OVERRIDE_CONTEXT_CLASS_NAME_STRING);
        }
        return undefined;
    },
};
