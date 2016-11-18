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
                <span>{"<NumericStepper />"}</span>
                <NumericStepper />
                <span>{"<NumericStepper buttonPosition='right' />"}</span>
                <NumericStepper buttonPosition="right" />
                <span>{"<NumericStepper buttonPosition='split' />"}</span>
                <NumericStepper buttonPosition="split" />
                <span>{"<NumericStepper buttonPosition='left' />"}</span>
                <NumericStepper buttonPosition="left" />
                <span>{"<NumericStepper buttonPosition='none' />"}</span>
                <NumericStepper buttonPosition="none" />
                <span>{"<NumericStepper intent={Intent.PRIMARY} />"}</span>
                <NumericStepper intent={Intent.PRIMARY} />
                <span>{"<NumericStepper intent={Intent.SUCCESS} />"}</span>
                <NumericStepper intent={Intent.SUCCESS} />
                <span>{"<NumericStepper intent={Intent.WARNING} />"}</span>
                <NumericStepper intent={Intent.WARNING} />
                <span>{"<NumericStepper intent={Intent.DANGER} />"}</span>
                <NumericStepper intent={Intent.DANGER} />
                <span>{"<NumericStepper placeholder='Enter a number...' />"}</span>
                <NumericStepper placeholder="Enter a number..." />
                <span>{"<NumericStepper value='10' />"}</span>
                <NumericStepper value="10" />
                <span>{"<NumericStepper value='10' disabled />"}</span>
                <NumericStepper value="10" disabled />
                <span>{"<NumericStepper value='10' readOnly />"}</span>
                <NumericStepper value="10" readOnly />
                <span>{"<NumericStepper min={4} />"}</span>
                <NumericStepper min={4} />
                <span>{"<NumericStepper max={4} />"}</span>
                <NumericStepper max={4} />
                <span>{"<NumericStepper min={0} max={10} />"}</span>
                <NumericStepper min={0} max={10} />
                <span>{"<NumericStepper min={0} max={100} stepSize={2} minorStepSize={0.2} majorStepSize={4} buttonPosition='split' />"}</span>
                <NumericStepper min={0} max={100} stepSize={2} minorStepSize={0.2} majorStepSize={4} buttonPosition="split" />
                <span>{"<NumericStepper value={4} />"}</span>
                <NumericStepper value={4} />
                <span>{"<NumericStepper value={'4'} />"}</span>
                <NumericStepper value={'4'} />
                <span>{"<NumericStepper onChange={console.log} />"}</span>
                <NumericStepper onChange={console.log} />
                <span>{"<NumericStepper placeholder={'Enter a number...'} />"}</span>
                <NumericStepper placeholder={"Enter a number..."} />
                <span>{"<NumericStepper leftIconName={'variable'} />"}</span>
                <NumericStepper leftIconName={"variable"} />
            </div>
        );
    }
}
