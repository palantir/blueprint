/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import { Intent } from "../../common";

export interface ISliderTrackStopProps {
    value: number;
    intentAfter?: Intent;
    intentBefore?: Intent;
}

export class SliderTrackStop extends React.PureComponent<ISliderTrackStopProps> {
    public static displayName = "Blueprint2.SliderTrackStop";
}
