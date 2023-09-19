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

import { format } from "date-fns";
import * as React from "react";

import { Tag } from "@blueprintjs/core";

export interface FormattedDateTagProps {
    /** The date or date string to display. */
    date: Date | string | null;

    /** @default false */
    showTime?: boolean;
}

export const FormattedDateTag: React.FC<FormattedDateTagProps> = ({ date, showTime }) => {
    const isEmpty = date == null;
    const dateFnsFormat = showTime ? "PPPppp" : "PPP";
    return (
        <Tag intent={isEmpty ? "none" : "primary"} minimal={isEmpty}>
            {isEmpty ? "No date" : typeof date === "string" ? date : format(date, dateFnsFormat)}
        </Tag>
    );
};
FormattedDateTag.defaultProps = {
    showTime: false,
};
