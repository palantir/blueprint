/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";
import { CaptionElementProps } from "react-day-picker";

import { AbstractPureComponent2, Divider } from "@blueprintjs/core";

export class DatePickerCaption extends AbstractPureComponent2<CaptionElementProps> {
    public render() {
        const formattedDateTime = this.props.date.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
        });

        return (
            <div className={this.props.classNames.caption}>
                {/** create hidden caption to label date grid for screenreaders */}
                <span className="screenreader-only">{formattedDateTime}</span>
                <Divider />
            </div>
        );
    }
}
