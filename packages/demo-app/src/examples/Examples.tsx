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

import classNames from "classnames";
import * as React from "react";

import { Classes } from "@blueprintjs/core";

import { DateInputExample } from "./DateInputExample";
import { DatePickerExample } from "./DatePickerExample";
import { DateRangeInputExample } from "./DateRangeInputExample";
import { DateRangePickerExample } from "./DateRangePickerExample";
import { TimePickerExample } from "./TimePickerExample";
import { TimezoneSelectExample } from "./TimezoneSelectExample";

export const Examples: React.FC = () => {
    return (
        <div className="examples-root">
            <ExamplesContainer />
            <ExamplesContainer isDark={true} />
        </div>
    );
};

Examples.displayName = "DemoApp.Examples";

const ExamplesContainer: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
    const className = isDark ? Classes.DARK : undefined;
    return (
        <div className={classNames("examples-container", className)}>
            <DatePickerExample />
            <DateInputExample />
            <DateRangePickerExample />
            <DateRangeInputExample />
            <TimePickerExample />
            <TimezoneSelectExample />
        </div>
    );
};

ExamplesContainer.displayName = "DemoApp.ExamplesContainer";
