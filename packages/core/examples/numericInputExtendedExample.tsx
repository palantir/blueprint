/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import {
    Keys,
    NumericInput,
} from "@blueprintjs/core";

import BaseExample from "./common/baseExample";

export interface INumericInputExtendedExampleState {
    value?: string;
}

const NumberAbbreviation = {
    BILLION : "b",
    MILLION : "m",
    THOUSAND : "k",
};

const NUMBER_ABBREVIATION_REGEX = /((\.\d+)|(\d+(\.\d+)?))(k|m|b)\b/gi;
const SCIENTIFIC_NOTATION_REGEX = /((\.\d+)|(\d+(\.\d+)?))(e\d+)\b/gi;

export class NumericInputExtendedExample extends BaseExample<INumericInputExtendedExampleState> {

    public state: INumericInputExtendedExampleState = {
        value: "",
    };

    protected renderExample() {
        const { value } = this.state;

        return (
            <div>
                <NumericInput
                    onBlur={this.handleBlur}
                    onKeyDown={this.handleKeyDown}
                    onValueChange={this.handleValueChange}
                    placeholder="Enter a number or expression..."
                    value={value}
                />
            </div>
        );
    }

    private handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        this.handleConfirm((e.target as HTMLInputElement).value);
    }

    private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === Keys.ENTER) {
            this.handleConfirm((e.target as HTMLInputElement).value);
        }
    }

    private handleValueChange = (_valueAsNumber: number, valueAsString: string) => {
        this.setState({ value: valueAsString });
    }

    private handleConfirm = (value: string) => {
        let result = value;
        result = this.expandScientificNotationTerms(result);
        result = this.expandNumberAbbreviationTerms(result);
        result = this.evaluateSimpleMathExpression(result);
        result = this.nanStringToEmptyString(result);
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

    private nanStringToEmptyString = (value: string) => {
        // our evaluation logic isn't perfect, so use this as a final
        // sanitization step if the result was not a number.
        return (value === "NaN") ? "" : value;
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
