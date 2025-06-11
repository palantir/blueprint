/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { Button, type ButtonVariant, H5, type IconName, type Intent, type Size, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { Dropdown } from "../../../../select/src/components/dropdown/dropdown";
import { PropCodeTooltip } from "../../common/propCodeTooltip";
import { IntentSelect } from "../core-examples/common/intentSelect";
import { SizeSelect } from "../core-examples/common/sizeSelect";
import { VariantSelect } from "../core-examples/common/variantSelect";

type ChartType = {
    name: string;
    icon: IconName;
    disabled?: boolean;
};

const CHART_TYPES: ChartType[] = [
    { icon: "timeline-area-chart", name: "Area chart" },
    { disabled: true, icon: "timeline-bar-chart", name: "Bar chart" },
    { icon: "pie-chart", name: "Pie chart" },
    { icon: "gantt-chart", name: "Gantt chart" },
    { disabled: true, icon: "timeline-line-chart", name: "Line chart" },
];

export const DropdownExample: React.FC<ExampleProps> = props => {
    const [value, setValue] = React.useState<ChartType | undefined>(CHART_TYPES[0]);

    const [disabled, setDisabled] = React.useState(false);
    const [disabledItems, setDisabledItems] = React.useState(false);
    const [fill, setFill] = React.useState(false);
    const [intent, setIntent] = React.useState<Intent>("none");
    const [showIcons, setShowIcons] = React.useState(true);
    const [matchTargetWidth, setMatchTargetWidth] = React.useState(false);
    const [minimal, setMinimal] = React.useState(true);
    const [size, setSize] = React.useState<Size>("medium");
    const [variant, setVariant] = React.useState<ButtonVariant>("solid");

    const handleClearSelect = React.useCallback(() => {
        setValue(undefined);
    }, []);
    const options = (
        <>
            <H5>Props</H5>
            <PropCodeTooltip snippet={`disabled={${disabled}}`}>
                <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`itemDisabled=${disabledItems ? '"disabled-property"' : "{undefined}"}`}>
                <Switch
                    checked={disabledItems}
                    label="Disabled items"
                    onChange={handleBooleanChange(setDisabledItems)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`fill={${fill}}`}>
                <Switch checked={fill} label="Fill container width" onChange={handleBooleanChange(setFill)} />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`itemIcon=${showIcons ? '"icon-property"' : "{undefined}"}`}>
                <Switch checked={showIcons} label="Show item icons" onChange={handleBooleanChange(setShowIcons)} />
            </PropCodeTooltip>
            <H5>Button props</H5>
            <PropCodeTooltip snippet={`buttonProps={{ size: ${size} }}`}>
                <SizeSelect onChange={setSize} size={size} />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`buttonProps={{ intent: ${intent} }}`}>
                <IntentSelect intent={intent} onChange={setIntent} />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`buttonProps={{ variant: ${variant} }}`}>
                <VariantSelect variant={variant} onChange={setVariant} />
            </PropCodeTooltip>
            <H5>Popover props</H5>
            <PropCodeTooltip snippet={`popoverProps={{ matchTargetWidth: ${matchTargetWidth} }}`}>
                <Switch
                    checked={matchTargetWidth}
                    label="Match target width"
                    onChange={handleBooleanChange(setMatchTargetWidth)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`popoverProps={{ minimal: ${minimal} }}`}>
                <Switch checked={minimal} label="Minimal popover style" onChange={handleBooleanChange(setMinimal)} />
            </PropCodeTooltip>
            <H5>Example</H5>
            <Button fill={true} onClick={handleClearSelect} text="Clear selection" />
        </>
    );
    return (
        <Example options={options} {...props}>
            <Dropdown
                disabled={disabled}
                buttonProps={{ intent, size, variant }}
                fill={fill}
                itemDisabled={disabledItems ? "disabled" : undefined}
                itemIcon={showIcons ? "icon" : undefined}
                itemKey="name"
                itemLabel="name"
                items={CHART_TYPES}
                onItemSelect={setValue}
                popoverProps={{ matchTargetWidth, minimal }}
                selectedItem={value}
            />
        </Example>
    );
};
