/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Intent } from "../../common";
import { AbstractPureComponent } from "../../common/abstractPureComponent";

export type SliderHandleType = "full" | "start" | "end";

export interface ISliderHandleProps {
    value: number;
    trackIntentAfter?: Intent;
    trackIntentBefore?: Intent;
    type?: SliderHandleType;
}

export class SliderHandle extends AbstractPureComponent<ISliderHandleProps> {
    public static displayName = "Blueprint2.SliderHandle";
}
