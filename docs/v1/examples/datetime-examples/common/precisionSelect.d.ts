/// <reference types="react" />
import * as React from "react";
import { TimePickerPrecision } from "@blueprintjs/datetime";
export interface IPrecisionSelectProps {
    /**
     * The precision-string option to display as selected.
     */
    value: TimePickerPrecision;
    /**
     * The callback to fire when the selected value changes.
     */
    onChange: (event: React.FormEvent<HTMLElement>) => void;
    /**
     * Whether or not to allow an empty option.
     */
    allowEmpty?: boolean;
    /**
     * Label to show over the dropdown of precisions.
     * @default "Precision"
     */
    label?: string;
}
export declare const PrecisionSelect: React.SFC<IPrecisionSelectProps>;
