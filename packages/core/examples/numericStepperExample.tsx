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
                <code>{"<NumericStepper />"}</code>
                <NumericStepper />
                <code>{"<NumericStepper buttonPosition='right' />"}</code>
                <NumericStepper buttonPosition="right" />
                <code>{"<NumericStepper buttonPosition='split' />"}</code>
                <NumericStepper buttonPosition="split" />
                <code>{"<NumericStepper buttonPosition='left' />"}</code>
                <NumericStepper buttonPosition="left" />
                <code>{"<NumericStepper buttonPosition='none' />"}</code>
                <NumericStepper buttonPosition="none" />
                <code>{"<NumericStepper intent={Intent.PRIMARY} />"}</code>
                <NumericStepper intent={Intent.PRIMARY} />
                <code>{"<NumericStepper intent={Intent.SUCCESS} />"}</code>
                <NumericStepper intent={Intent.SUCCESS} />
                <code>{"<NumericStepper intent={Intent.WARNING} />"}</code>
                <NumericStepper intent={Intent.WARNING} />
                <code>{"<NumericStepper intent={Intent.DANGER} />"}</code>
                <NumericStepper intent={Intent.DANGER} />
                <code>{"<NumericStepper intent={Intent.DANGER} leftIconName='variable' />"}</code>
                <NumericStepper intent={Intent.DANGER} leftIconName="variable" />
                <code>{"<NumericStepper placeholder='Enter a number...' />"}</code>
                <NumericStepper placeholder="Enter a number..." />
                <code>{"<NumericStepper value='10' />"}</code>
                <NumericStepper value="10" />
                <code>{"<NumericStepper value='10' disabled />"}</code>
                <NumericStepper value="10" disabled />
                <code>{"<NumericStepper value='10' readOnly />"}</code>
                <NumericStepper value="10" readOnly />
                <code>{"<NumericStepper min={4} />"}</code>
                <NumericStepper min={4} />
                <code>{"<NumericStepper max={4} />"}</code>
                <NumericStepper max={4} />
                <code>{"<NumericStepper min={0} max={10} />"}</code>
                <NumericStepper min={0} max={10} />
                <code>{"<NumericStepper min={0} max={100} stepSize={2} minorStepSize={0.2} majorStepSize={4} buttonPosition='split' />"}</code>
                <NumericStepper min={0} max={100} stepSize={2} minorStepSize={0.2} majorStepSize={4} buttonPosition="split" />
                <code>{"<NumericStepper value={4} />"}</code>
                <NumericStepper value={4} />
                <code>{"<NumericStepper value={'4'} />"}</code>
                <NumericStepper value={'4'} />
                <code>{"<NumericStepper onChange={console.log} />"}</code>
                <NumericStepper onChange={console.log} />
                <code>{"<NumericStepper placeholder={'Enter a number...'} />"}</code>
                <NumericStepper placeholder={"Enter a number..."} />
                <code>{"<NumericStepper leftIconName={'variable'} />"}</code>
                <NumericStepper leftIconName={"variable"} />
            </div>
        );
    }
}
