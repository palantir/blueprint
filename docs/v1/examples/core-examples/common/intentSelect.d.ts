/// <reference types="react" />
import { Intent } from "@blueprintjs/core";
import * as React from "react";
export interface IIntentSelectProps {
    intent: Intent;
    onChange: React.FormEventHandler<HTMLSelectElement>;
}
export declare const IntentSelect: React.SFC<IIntentSelectProps>;
