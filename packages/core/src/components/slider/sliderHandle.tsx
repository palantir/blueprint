/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import { Intent } from "../../common";

export type SliderHandleType = "full" | "start" | "end";

export interface ISliderHandleProps {
    value: number;
    trackIntentAfter?: Intent;
    trackIntentBefore?: Intent;
    type?: SliderHandleType;
}

export class SliderHandle extends React.PureComponent<ISliderHandleProps> {
    public static displayName = "Blueprint2.SliderHandle";
}
