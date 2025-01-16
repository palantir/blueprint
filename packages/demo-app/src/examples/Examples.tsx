/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import * as React from "react";

import { Classes } from "@blueprintjs/core";

import { BreadcrumbExample } from "./BreadcrumbExample";
import { ButtonExample } from "./ButtonExample";
import { ButtonGroupExample } from "./ButtonGroupExample";
import { CalloutExample } from "./CalloutExample";
import { CheckboxRadioExample } from "./CheckboxRadioExample";
import { DatePickerExample } from "./DatePickerExample";
import { DateRangePickerExample } from "./DateRangePickerExample";
import { DialogExample } from "./DialogExample";
import { EditableTextExample } from "./EditableTextExample";
import { EntityTitleExample } from "./EntityTitleExample";
import { HtmlCodeExample } from "./HtmlCodeExample";
import { HtmlTableExample } from "./HtmlTableExample";
import { IconExample } from "./IconExample";
import { InputExample } from "./InputExample";
import { MenuExample } from "./MenuExample";
import { NonIdealStateExample } from "./NonIdealStateExample";
import { PopoverExample } from "./PopoverExample";
import { SandpackExample } from "./SandpackExample";
import { SliderExample } from "./SliderExample";
import { SpinnerExample } from "./SpinnerExample";
import { SwitchExample } from "./SwitchExample";
import { TableExample } from "./TableExample";
import { TabsExample } from "./TabsExample";
import { TagExample } from "./TagExample";
import { TagInputExample } from "./TagInputExample";
import { TextExample } from "./TextExample";
import { ToastExample } from "./ToastExample";
import { TooltipExample } from "./TooltipExample";
import { TreeExample } from "./TreeExample";

export const Examples: React.FC = () => {
    return (
        <div className="examples-root">
            <ExamplesContainer />
        </div>
    );
};

Examples.displayName = "DemoApp.Examples";

const ExamplesContainer: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
    const className = isDark ? Classes.DARK : undefined;
    return (
        <div className={classNames("examples-container", className)}>
            <SandpackExample />
            <BreadcrumbExample />
            <ButtonExample />
            <ButtonGroupExample />
            <CalloutExample />
            <CheckboxRadioExample />
            <DatePickerExample />
            <DateRangePickerExample />
            <DialogExample className={className} />
            <EditableTextExample />
            <EntityTitleExample />
            <HtmlCodeExample />
            <HtmlTableExample />
            <IconExample />
            <InputExample />
            <MenuExample />
            <NonIdealStateExample />
            <PopoverExample />
            <SliderExample />
            <SpinnerExample />
            <SwitchExample />
            <TableExample />
            <TabsExample />
            <TagExample />
            <TagInputExample />
            <TextExample />
            <ToastExample />
            <TooltipExample />
            <TreeExample />
        </div>
    );
};

ExamplesContainer.displayName = "DemoApp.ExamplesContainer";
