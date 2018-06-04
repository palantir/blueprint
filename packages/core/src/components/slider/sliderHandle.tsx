/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Intent } from "../../common/intent";

export const SliderHandleType = {
    FULL: "full" as "full",
    START: "start" as "start",
    // tslint:disable-next-line:object-literal-sort-keys
    END: "end" as "end",
};
export type SliderHandleType = typeof SliderHandleType[keyof typeof SliderHandleType];

export const SliderHandleInteractionKind = {
    LOCK: "lock" as "lock",
    NONE: "none" as "none",
    PUSH: "push" as "push",
};
export type SliderHandleInteractionKind = typeof SliderHandleInteractionKind[keyof typeof SliderHandleInteractionKind];

export interface ISliderHandleProps {
    value: number;
    intentAfter?: Intent;
    intentBefore?: Intent;
    interactionKind?: SliderHandleInteractionKind;
    type?: SliderHandleType;
}

export class SliderHandle extends React.PureComponent<ISliderHandleProps> {
    public static displayName = "Blueprint2.SliderHandle";
}
