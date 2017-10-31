/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
