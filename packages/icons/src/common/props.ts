/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Intent } from "./intent";

/**
 * A shared base interface for all Blueprint component props.
 */
export interface IProps {
    /** A space-delimited list of class names to pass along to a child element. */
    className?: string;
}

export interface IIntentProps {
    /** Visual intent color to apply to element. */
    intent?: Intent;
}
