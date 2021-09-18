/* Copyright 2021 Palantir Technologies, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

import classNames from "classnames";
import * as React from "react";

import { Button, Classes } from "@blueprintjs/core";

import { BreadcrumbExample } from "./BreadcrumbExample";
import { ButtonExample } from "./ButtonExample";
import { CalloutExample } from "./CalloutExample";
import { CheckboxRadioExample } from "./CheckboxExample";
import { DialogExample } from "./DialogExample";
import { EditableTextExample } from "./EditableTextExample";
import { HtmlCodeExample } from "./HtmlCodeExample";
import { IconExample } from "./IconExample";
import { MenuExample } from "./MenuExample";
import { SwitchExample } from "./SwitchExample";
import { TabsExample } from "./TabsExample";
import { TagExample } from "./TagExample";
import { TextExample } from "./TextExample";
import { TooltipExample } from "./TooltipExample";
import { TreeExample } from "./TreeExample";

export interface ExamplesState {
    isDarkMode: boolean;
}

export class Examples extends React.PureComponent<{}, ExamplesState> {
    public state: ExamplesState = { isDarkMode: false };

    private toggleDarkMode = () => this.setState({ isDarkMode: !this.state.isDarkMode });

    public render() {
        return (
            <div className={classNames("examples-root", { [Classes.DARK]: this.state.isDarkMode })}>
                <div className={classNames("toggle-mode-button-container", { [Classes.DARK]: this.state.isDarkMode })}>
                    <Button
                        className="toggle-mode-button"
                        minimal={true}
                        text={`Toggle ${this.state.isDarkMode ? "light mode" : "dark mode"}`}
                        onClick={this.toggleDarkMode}
                    />
                </div>
                <div className="examples-container">
                    <BreadcrumbExample />
                    <ButtonExample />
                    <CalloutExample />
                    <CheckboxRadioExample />
                    {/* Add DatePickerExample */}
                    <DialogExample isDarkMode={this.state.isDarkMode} />
                    <EditableTextExample />
                    <HtmlCodeExample />
                    <IconExample />
                    {/* Add InputExample */}
                    <MenuExample />
                    <SwitchExample />
                    {/* Add TableExample */}
                    <TabsExample />
                    <TagExample />
                    <TextExample />
                    {/* Add ToastExample */}
                    <TooltipExample />
                    <TreeExample />
                </div>
            </div>
        );
    }
}
