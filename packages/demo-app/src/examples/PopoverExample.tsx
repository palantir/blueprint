/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { Button, Classes, H5, Intent, Popover } from "@blueprintjs/core";

export const PopoverExample = React.memo(() => {
    return (
        <div className="popover-example">
            <Popover content={content} placement="top" popoverClassName={Classes.POPOVER_CONTENT_SIZING}>
                <Button intent="primary" tabIndex={0} text="Popover target" />
            </Popover>
            <Popover content={content} placement="top" popoverClassName={Classes.POPOVER_CONTENT_SIZING}>
                <Button intent="primary" tabIndex={0} text="Popover target" />
            </Popover>
        </div>
    );
});

const content = (
    <div>
        <H5>Confirm deletion</H5>
        <p>Are you sure you want to delete these items? You won't be able to recover them.</p>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}>
            <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                Cancel
            </Button>
            <Button className={Classes.POPOVER_DISMISS} intent={Intent.DANGER}>
                Delete
            </Button>
        </div>
    </div>
);

PopoverExample.displayName = "DemoApp.PopoverExample";
