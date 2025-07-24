/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { DateInput } from "@blueprintjs/datetime";

export const DateInputExample = React.memo(() => {
    return (
        <div className="demo-example">
            <div className="demo-example-content">
                <DateInput />
            </div>
            <div className="demo-example-content">
                <DateInput floating={true} />
            </div>
        </div>
    );
});

DateInputExample.displayName = "DemoApp.DateInputExample";
