/* Copyright 2020 Palantir Technologies, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

import * as React from "react";

import { Classes } from "@blueprintjs/core";
import { DateRangePicker } from "@blueprintjs/datetime";

import { ExampleCard } from "./ExampleCard";

export const DateRangePickerExample = React.memo(() => {
    return (
        <ExampleCard width={700} horizontal={true} label="Date range picker">
            <DateRangePicker className={Classes.ELEVATION_1} />
        </ExampleCard>
    );
});
DateRangePickerExample.displayName = "DateRangerPickerExample";
