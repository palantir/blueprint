/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface INumericInputExtendedExampleState {
    value?: string;
}
export declare class NumericInputExtendedExample extends BaseExample<INumericInputExtendedExampleState> {
    state: INumericInputExtendedExampleState;
    protected renderExample(): JSX.Element;
    private handleBlur;
    private handleKeyDown;
    private handleValueChange;
    private handleConfirm;
    private expandScientificNotationTerms;
    private expandNumberAbbreviationTerms;
    private evaluateSimpleMathExpression;
    private nanStringToEmptyString;
    private expandAbbreviatedNumber;
    private expandScientificNotationNumber;
    private roundValue;
}
