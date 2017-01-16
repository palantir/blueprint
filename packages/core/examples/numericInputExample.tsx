/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import {
    Classes,
    Intent,
    Keys,
    NumericInput,
    Position,
    Switch,
} from "@blueprintjs/core";

import BaseExample, { handleBooleanChange, handleNumberChange } from "./common/baseExample";
import { IntentSelect } from "./common/intentSelect";

export interface INumericInputExampleState {

    buttonPositionIndex?: number;

    minValueIndex?: number;
    maxValueIndex?: number;

    stepSizeIndex?: number;
    majorStepSizeIndex?: number;
    minorStepSizeIndex?: number;

    intent?: Intent;

    showDisabled?: boolean;
    showLargeSize?: boolean;
    showLeftIcon?: boolean;
    showReadOnly?: boolean;

    value?: string;
}

interface ISelectOption {
    label: string;
    value: any;
}

const MIN_VALUES: ISelectOption[] = [
    { label: "None", value: null },
    { label: "-10", value: -10 },
    { label: "0", value: 0 },
    { label: "10", value: 10 },
];

const MAX_VALUES: ISelectOption[] = [
    { label: "None", value: null },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
];

const STEP_SIZES: ISelectOption[] = [
    { label: "1", value: 1 },
    { label: "1", value: 2 },
];

const MINOR_STEP_SIZES: ISelectOption[] = [
    { label: "None", value: null },
    { label: "0.1", value: 0.1 },
    { label: "0.2", value: 0.2 },
];

const MAJOR_STEP_SIZES: ISelectOption[] = [
    { label: "None", value: null },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
];

const BUTTON_POSITIONS: ISelectOption[] = [
    { label: "None", value: null },
    { label: "Left", value: Position.LEFT },
    { label: "Right", value: Position.RIGHT },
];

const NumberAbbreviation = {
    BILLION : "b",
    MILLION : "m",
    THOUSAND : "k",
};

const NUMBER_ABBREVIATION_REGEX = /((\.\d+)|(\d+(\.\d+)?))(k|m|b)\b/gi;
const SCIENTIFIC_NOTATION_REGEX = /((\.\d+)|(\d+(\.\d+)?))(e\d+)\b/gi;

export class NumericInputExample extends BaseExample<INumericInputExampleState> {

    public state: INumericInputExampleState = {
        buttonPositionIndex: 2,
        intent: Intent.NONE,
        majorStepSizeIndex: 1,
        maxValueIndex: 0,
        minValueIndex: 0,
        minorStepSizeIndex: 1,

        showDisabled: false,
        showLeftIcon: false,
        showReadOnly: false,

        stepSizeIndex: 0,

        value: "",
    };

    private handleMaxValueChange = handleNumberChange((maxValueIndex) => this.setState({ maxValueIndex }));
    private handleMinValueChange = handleNumberChange((minValueIndex) => this.setState({ minValueIndex }));
    private handleIntentChange = handleNumberChange((intent: Intent) => this.setState({ intent }));

    private handleButtonPositionChange = handleNumberChange((buttonPositionIndex) => {
        this.setState({ buttonPositionIndex });
    });

    private toggleDisabled = handleBooleanChange((showDisabled) => this.setState({ showDisabled }));
    private toggleLeftIcon = handleBooleanChange((showLeftIcon) => this.setState({ showLeftIcon }));
    private toggleReadOnly = handleBooleanChange((showReadOnly) => this.setState({ showReadOnly }));

    protected renderOptions() {
        const {
            buttonPositionIndex,
            intent,
            maxValueIndex,
            minValueIndex,
            showDisabled,
            showReadOnly,
            showLeftIcon,
        } = this.state;

        return [
            [
                this.renderSelectMenu("Minimum value", minValueIndex, MIN_VALUES, this.handleMinValueChange),
                this.renderSelectMenu("Maximum value", maxValueIndex, MAX_VALUES, this.handleMaxValueChange),
            ], [
                this.renderSelectMenu(
                    "Button position", buttonPositionIndex, BUTTON_POSITIONS, this.handleButtonPositionChange),
                <IntentSelect intent={intent} key="intent" onChange={this.handleIntentChange} />,
            ], [
                <label className={Classes.LABEL} key="modifierslabel">Modifiers</label>,
                this.renderSwitch("Disabled", showDisabled, this.toggleDisabled),
                this.renderSwitch("Read-only", showReadOnly, this.toggleReadOnly),
                this.renderSwitch("Left icon", showLeftIcon, this.toggleLeftIcon),
            ],
        ];
    }

    protected renderExample() {
        const { value } = this.state;

        return (
            <div>
                <NumericInput
                    buttonPosition={BUTTON_POSITIONS[this.state.buttonPositionIndex].value}
                    intent={this.state.intent}

                    min={MIN_VALUES[this.state.minValueIndex].value}
                    max={MAX_VALUES[this.state.maxValueIndex].value}

                    stepSize={STEP_SIZES[this.state.stepSizeIndex].value}
                    majorStepSize={MAJOR_STEP_SIZES[this.state.majorStepSizeIndex].value}
                    minorStepSize={MINOR_STEP_SIZES[this.state.minorStepSizeIndex].value}

                    disabled={this.state.showDisabled}
                    readOnly={this.state.showReadOnly}
                    leftIconName={this.state.showLeftIcon ? "dollar" : null}
                    placeholder="Enter a number..."

                    onBlur={this.handleBlur}
                    onKeyDown={this.handleKeyDown}
                    value={value}
                />
            </div>
        );
    }

    private renderSwitch(label: string, checked: boolean, onChange: React.FormEventHandler<HTMLElement>) {
       return (
            <Switch
                checked={checked}
                label={label}
                key={label}
                onChange={onChange}
            />
        );
    }

    private renderSelectMenu(
        label: string,
        selectedValue: number | string,
        options: ISelectOption[],
        onChange: React.FormEventHandler<HTMLElement>,
    ) {
        return (
            <label className={Classes.LABEL} key={label}>
                {label}
                <div className={Classes.SELECT}>
                    <select value={selectedValue} onChange={onChange}>
                        {this.renderSelectMenuOptions(options)}
                    </select>
                </div>
            </label>
        );
    }

    private renderSelectMenuOptions(options: ISelectOption[]) {
        return options.map((option, index) => {
            return <option key={index} value={index}>{option.label}</option>;
        });
    }

    private handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        this.handleConfirm((e.target as HTMLInputElement).value);
    }

    private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === Keys.ENTER) {
            this.handleConfirm((e.target as HTMLInputElement).value);
        }
    }

    private handleConfirm = (value: string) => {
        let result = value;
        result = this.expandScientificNotationTerms(result);
        result = this.expandNumberAbbreviationTerms(result);
        result = this.evaluateSimpleMathExpression(result);
        this.setState({ value: result });

        // the user could have typed a different expression that evaluates to
        // the same value. force the update to ensure a render triggers even if
        // this is the case.
        this.forceUpdate();
    }

    private expandScientificNotationTerms = (value: string) => {
        // leave empty strings empty
        if (!value) {
            return value;
        }
        return value.replace(SCIENTIFIC_NOTATION_REGEX, this.expandScientificNotationNumber);
    }

    private expandNumberAbbreviationTerms = (value: string) => {
        // leave empty strings empty
        if (!value) {
            return value;
        }
        return value.replace(NUMBER_ABBREVIATION_REGEX, this.expandAbbreviatedNumber);
    }

    // tslint:disable-next-line:max-line-length
    // Adapted from http://stackoverflow.com/questions/2276021/evaluating-a-string-as-a-mathematical-expression-in-javascript
    private evaluateSimpleMathExpression = (value: string) => {
        // leave empty strings empty
        if (!value) {
            return value;
        }

        // parse all terms from the expression. we allow simple addition and
        // subtraction only, so we'll split on the + and - characters and then
        // validate that each term is a number.
        const terms = value.split(/[+\-]/);

        // ex. "1 + 2 - 3 * 4" will parse on the + and - signs into
        // ["1 ", " 2 ", " 3 * 4"]. after trimming whitespace from each term
        // and coercing them to numbers, the third term will become NaN,
        // indicating that there was some illegal character present in it.
        const trimmedTerms = terms.map((term: string) => term.trim());
        const numericTerms = trimmedTerms.map((term: string) => +term);
        const illegalTerms = numericTerms.filter((term: number) => isNaN(term));

        if (illegalTerms.length > 0) {
            return "";
        }

        // evaluate the expression now that we know it's valid
        let total = 0;

        // the regex below will match decimal numbers--optionally preceded by
        // +/- followed by any number of spaces—-including each of the
        // following:
        // ".1"
        // "  1"
        // "1.1"
        // "+ 1"
        // "-   1.1"
        const matches = value.match(/[+\-]*\s*(\.\d+|\d+(\.\d+)?)/gi) || [];
        for (const match of matches) {
            const compactedMatch = match.replace(/\s/g, "");
            total += parseFloat(compactedMatch);
        }
        const roundedTotal = this.roundValue(total);
        return roundedTotal.toString();
    }

    private expandAbbreviatedNumber = (value: string) => {
        if (!value) {
            return value;
        }

        const number = +(value.substring(0, value.length - 1));
        const lastChar = value.charAt(value.length - 1).toLowerCase();

        let result: number;

        if (lastChar === NumberAbbreviation.THOUSAND) {
            result = number * 1e3;
        } else if (lastChar === NumberAbbreviation.MILLION) {
            result = number * 1e6;
        } else if (lastChar === NumberAbbreviation.BILLION) {
            result = number * 1e9;
        }

        const isValid = result != null && !isNaN(result);

        if (isValid) {
            result = this.roundValue(result);
        }

        return (isValid) ? result.toString() : "";
    }

    private expandScientificNotationNumber = (value: string) => {
        if (!value) {
            return value;
        }
        return (+value).toString();
    }

    private roundValue = (value: number, precision: number = 1) => {
        // round to at most two decimal places
        return Math.round(value * (10 ** precision)) / (10 ** precision);
    }
}
