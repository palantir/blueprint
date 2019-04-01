/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
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

import { Classes, Icon, IconName, KeyCombo } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

export interface INavButtonProps {
    icon: IconName;
    hotkey: string;
    text: string;
    onClick: () => void;
}

export const NavButton: React.SFC<INavButtonProps> = props => (
    <div className={classNames("docs-nav-button", Classes.TEXT_MUTED)} onClick={props.onClick}>
        <Icon icon={props.icon} />
        <span className={Classes.FILL}>{props.text}</span>
        <div style={{ opacity: 0.5 }}>
            <KeyCombo combo={props.hotkey} minimal={true} />
        </div>
    </div>
);
