/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import { CSSTransition } from "react-transition-group";
import { IOverlayProps } from "./overlay";

export function OverlayTransition<
    T extends Pick<IOverlayProps, "transitionName" | "transitionDuration"> & { children: React.ReactNode }
>({ children, transitionDuration, transitionName }: T) {
    return (
        <CSSTransition classNames={transitionName} timeout={transitionDuration}>
            {children}
        </CSSTransition>
    );
}
