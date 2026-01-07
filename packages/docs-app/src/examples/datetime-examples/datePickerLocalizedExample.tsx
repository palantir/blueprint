/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { useState } from "react";

import { H5 } from "@blueprintjs/core";
import { DatePicker } from "@blueprintjs/datetime";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";

import { type CommonDateFnsLocale, DateFnsLocaleSelect } from "../../common/dateFnsLocaleSelect";

export const DatePickerLocalizedExample: React.FC<ExampleProps> = props => {
    const [localeCode, setlocaleCode] = useState<CommonDateFnsLocale>("fr");

    const options = (
        <>
            <H5>Locale code</H5>
            <DateFnsLocaleSelect value={localeCode} onChange={setlocaleCode} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <DatePicker locale={localeCode} />
        </Example>
    );
};
