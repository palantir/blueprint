/// <reference types="react" />
import { Intent } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
export interface INumericInputBasicExampleState {
    buttonPositionIndex?: number;
    minValueIndex?: number;
    maxValueIndex?: number;
    stepSizeIndex?: number;
    majorStepSizeIndex?: number;
    minorStepSizeIndex?: number;
    intent?: Intent;
    numericCharsOnly?: boolean;
    selectAllOnFocus?: boolean;
    selectAllOnIncrement?: boolean;
    showDisabled?: boolean;
    showFullWidth?: boolean;
    showLargeSize?: boolean;
    showLeftIcon?: boolean;
    showReadOnly?: boolean;
    value?: string;
}
export declare class NumericInputBasicExample extends BaseExample<INumericInputBasicExampleState> {
    state: INumericInputBasicExampleState;
    private handleMaxValueChange;
    private handleMinValueChange;
    private handleIntentChange;
    private handleButtonPositionChange;
    private toggleDisabled;
    private toggleLeftIcon;
    private toggleReadOnly;
    private toggleFullWidth;
    private toggleLargeSize;
    private toggleNumericCharsOnly;
    private toggleSelectAllOnFocus;
    private toggleSelectAllOnIncrement;
    protected renderOptions(): JSX.Element[][];
    protected renderExample(): JSX.Element;
    private renderSwitch(label, checked, onChange);
    private renderSelectMenu(label, selectedValue, options, onChange);
    private renderSelectMenuOptions(options);
    private handleValueChange;
}
