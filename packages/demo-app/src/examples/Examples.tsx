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

import { Classes } from "@blueprintjs/core";

import { BreadcrumbExample } from "./BreadcrumbExample";
import { ButtonExample } from "./ButtonExample";
import { CalloutExample } from "./CalloutExample";
import { CheckboxRadioExample } from "./CheckboxRadioExample";
import { DatePickerExample } from "./DatePickerExample";
import { DateRangePickerExample } from "./DateRangePickerExample";
import { DialogExample } from "./DialogExample";
import { EditableTextExample } from "./EditableTextExample";
import { HtmlCodeExample } from "./HtmlCodeExample";
import { HtmlTableExample } from "./HtmlTableExample";
import { IconExample } from "./IconExample";
import { InputExample } from "./InputExample";
import { MenuExample } from "./MenuExample";
import { SliderExample } from "./SliderExample";
import { SwitchExample } from "./SwitchExample";
import { TableExample } from "./TableExample";
import { TabsExample } from "./TabsExample";
import { TagExample } from "./TagExample";
import { TextExample } from "./TextExample";
import { ToastExample } from "./ToastExample";
import { TooltipExample } from "./TooltipExample";
import { TreeExample } from "./TreeExample";

export class Examples extends React.PureComponent {
    private renderExamples(className?: string) {
        return (
            <div className={classNames("examples-container", className)}>
                <BreadcrumbExample />
                <ButtonExample />
                <CalloutExample />
                <CheckboxRadioExample />
                <DatePickerExample />
                <DateRangePickerExample />
                <DialogExample className={className} />
                <EditableTextExample />
                <HtmlCodeExample />
                <HtmlTableExample />
                <IconExample />
                <InputExample />
                <MenuExample />
                <SliderExample />
                <SwitchExample />
                <TableExample />
                <TabsExample />
                <TagExample />
                <TextExample />
                <ToastExample />
                <TooltipExample />
                <TreeExample />
            </div>
        );
    }

    public render() {
        return (
            <div className="examples-root">
                {this.renderExamples()}
                {this.renderExamples(Classes.DARK)}
            </div>
        );
    }
}
