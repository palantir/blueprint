/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { Button, Icon } from "@blueprintjs/core";

export default function IconUsage() {
    return (
        <div className="group">
            <Button icon="refresh" intent="danger" text="Reset" />
            <Button icon="user" endIcon="caret-down" text="Profile settings" />
            <Button endIcon={<Icon icon="arrow-right" />} intent="success" text="Next step" />
            <Button endIcon={<Icon icon="upload" />} text="Upload" />
        </div>
    );
}
