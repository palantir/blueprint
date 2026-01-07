/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { useCallback, useState } from "react";

import { NumericInput } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";

const NumberAbbreviation = {
    BILLION: "b",
    MILLION: "m",
    THOUSAND: "k",
};

const NUMBER_ABBREVIATION_REGEX = /((\.\d+)|(\d+(\.\d+)?))(k|m|b)\b/gi;
const SCIENTIFIC_NOTATION_REGEX = /((\.\d+)|(\d+(\.\d+)?))(e\d+)\b/gi;

export const NumericInputExtendedExample: React.FC<ExampleProps> = props => {
    const [value, setValue] = useState<string>("");

    const handleConfirm = useCallback((newValue: string) => {
        let result = newValue;
        result = expandScientificNotationTerms(result);
        result = expandNumberAbbreviationTerms(result);
        result = evaluateSimpleMathExpression(result);
        result = nanStringToEmptyString(result);
        setValue(result);
    }, []);

    const handleBlur = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            handleConfirm(event.target.value);
        },
        [handleConfirm],
    );

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                handleConfirm(event.currentTarget.value);
            }
        },
        [handleConfirm],
    );

    const handleValueChange = useCallback((_valueAsNumber: number, valueAsString: string) => {
        setValue(valueAsString);
    }, []);

    return (
        <Example options={false} {...props}>
            <NumericInput
                allowNumericCharactersOnly={false}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onValueChange={handleValueChange}
                placeholder="Enter a number or expression..."
                value={value}
            />
        </Example>
    );
};

const expandScientificNotationTerms = (value: string) => {
    // leave empty strings empty
    if (!value) {
        return value;
    }
    return value.replace(SCIENTIFIC_NOTATION_REGEX, expandScientificNotationNumber);
};

const expandNumberAbbreviationTerms = (value: string) => {
    // leave empty strings empty
    if (!value) {
        return value;
    }
    return value.replace(NUMBER_ABBREVIATION_REGEX, expandAbbreviatedNumber);
};

// Adapted from http://stackoverflow.com/questions/2276021/evaluating-a-string-as-a-mathematical-expression-in-javascript
const evaluateSimpleMathExpression = (value: string) => {
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
    const illegalTerms = numericTerms.filter(isNaN);

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
    const roundedTotal = roundValue(total);
    return roundedTotal.toString();
};

const nanStringToEmptyString = (value: string) => {
    // our evaluation logic isn't perfect, so use this as a final
    // sanitization step if the result was not a number.
    return value === "NaN" ? "" : value;
};

const expandAbbreviatedNumber = (value: string) => {
    if (!value) {
        return value;
    }

    const num = +value.substring(0, value.length - 1);
    const lastChar = value.charAt(value.length - 1).toLowerCase();

    let result: number;

    if (lastChar === NumberAbbreviation.THOUSAND) {
        result = num * 1e3;
    } else if (lastChar === NumberAbbreviation.MILLION) {
        result = num * 1e6;
    } else if (lastChar === NumberAbbreviation.BILLION) {
        result = num * 1e9;
    }

    const isValid = result != null && !isNaN(result);

    if (isValid) {
        result = roundValue(result);
    }

    return isValid ? result.toString() : "";
};

const expandScientificNotationNumber = (value: string) => {
    if (!value) {
        return value;
    }
    return (+value).toString();
};

const roundValue = (value: number, precision: number = 1) => {
    // round to at most two decimal places
    return Math.round(value * 10 ** precision) / 10 ** precision;
};
