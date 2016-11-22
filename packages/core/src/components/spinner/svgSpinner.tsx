/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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
                <g className="pt-svg-spinner-transform-group">
                    {content}
                </g>
            </g>
        );
    }
}

export var SVGSpinnerFactory = React.createFactory(SVGSpinner);
