/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { InputGroup } from "@blueprintjs/core";
import { DateInput3, DateRangeInput3 } from "@blueprintjs/datetime2";

export const DateRangeInputExample = React.memo(() => {
    return (
        <>
            <DateInput3 />
            <DateRangeInput3 />
            <InputGroup leftIcon="search" placeholder="Search..." />
        </>
    );
});

DateRangeInputExample.displayName = "DemoApp.DateRangeInputExample";
