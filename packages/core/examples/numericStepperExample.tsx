/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import { NumericStepper } from "../src";
import { Intent } from "../src/common/intent";
import BaseExample from "./common/baseExample";

export class NumericStepperExample extends BaseExample<{}> {

    protected renderExample() {
        return (
            <div className="pt-numeric-stepper-example">
                <NumericStepper />
                <NumericStepper buttonPosition="right" />
                <NumericStepper buttonPosition="split" />
                <NumericStepper buttonPosition="left" />
                <NumericStepper hasButtons={false} />
                <NumericStepper intent={Intent.PRIMARY} />
                <NumericStepper intent={Intent.SUCCESS} />
                <NumericStepper intent={Intent.WARNING} />
                <NumericStepper intent={Intent.DANGER} />
                <NumericStepper placeholder="Enter a number..." />
                <NumericStepper value="10" />
                <NumericStepper value="10" disabled />
                <NumericStepper value="10" readOnly />
                <NumericStepper min={4} />
                <NumericStepper max={4} />
            </div>
        );
    }
}
