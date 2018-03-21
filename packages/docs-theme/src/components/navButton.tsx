/*
* Copyright 2018 Palantir Technologies, Inc. All rights reserved.
*
* Licensed under the terms of the LICENSE file distributed with this project.
*/

import { Classes, Icon, IconName, KeyCombo } from "@blueprintjs/core";
import * as React from "react";

export interface INavButtonProps {
    icon: IconName;
    hotkey: string;
    text: string;
    onClick: () => void;
}

export const NavButton: React.SFC<INavButtonProps> = props => (
    <div className="docs-nav-button pt-text-muted" onClick={props.onClick}>
        <Icon icon={props.icon} />
        <span className={Classes.FILL}>{props.text}</span>
        <div style={{ opacity: 0.5 }}>
            <KeyCombo combo={props.hotkey} minimal={true} />
        </div>
    </div>
);
