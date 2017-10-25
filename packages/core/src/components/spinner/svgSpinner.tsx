/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
// import * to avoid "cannot be named" error on factory
import * as spinner from "./spinner";

export class SVGSpinner extends spinner.Spinner {
    protected renderContainer(classes: string, content: JSX.Element) {
        return (
            <g className={classNames(Classes.SVG_SPINNER, classes)}>
                <g className="pt-svg-spinner-transform-group">{content}</g>
            </g>
        );
    }
}

export const SVGSpinnerFactory = React.createFactory(SVGSpinner);
