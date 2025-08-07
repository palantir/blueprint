/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { useCallback, useState } from "react";

import {
    Button,
    FormGroup,
    H5,
    NonIdealState,
    NonIdealStateIconSize,
    SegmentedControl,
    Spinner,
    Switch,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { type IconName, IconNames } from "@blueprintjs/icons";

import { IconSelect } from "./common/iconSelect";
import { type Layout, LayoutSelect } from "./common/layoutSelect";
import { LegacySizeSelect, type Size } from "./common/legacySizeSelect";

export const NonIdealStateExample: React.FC<ExampleProps> = props => {
    const [icon, setIcon] = useState<IconName>(IconNames.SEARCH);
    const [iconSize, setIconSize] = useState(NonIdealStateIconSize.STANDARD);
    const [layout, setLayout] = useState<Layout>("vertical");
    const [showAction, setShowAction] = useState(true);
    const [showDescription, setShowDescription] = useState(true);
    const [showTitle, setShowTitle] = useState(true);
    const [visual, setVisual] = useState<NonIdealStateVisualKind>("icon");

    const handleSizeChange = useCallback(
        (size: Size) => setIconSize(sizeToNonIdealStateIconSize[size]),
        [],
    );

    const options = (
        <>
            <H5>Props</H5>
            <LayoutSelect layout={layout} onChange={setLayout} />
            <NonIdealStateVisualSelect onChange={setVisual} visual={visual} />
            <IconSelect disabled={visual !== "icon"} iconName={icon} onChange={setIcon} />
            <LegacySizeSelect
                label="Visual size"
                onChange={handleSizeChange}
                optionLabels={["XS", "Small", "Standard"]}
                size={nonIdealStateIconSizeToSize[iconSize]}
            />
            <Switch
                checked={showTitle}
                label="Show title"
                onChange={handleBooleanChange(setShowTitle)}
            />
            <Switch
                checked={showDescription}
                label="Show description"
                onChange={handleBooleanChange(setShowDescription)}
            />
            <Switch
                checked={showAction}
                label="Show action"
                onChange={handleBooleanChange(setShowAction)}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <NonIdealState
                action={
                    showAction && (
                        <Button text="New file" icon="plus" intent="primary" variant="outlined" />
                    )
                }
                description={
                    showDescription && (
                        <div>
                            Your search didn't match any files.
                            <br />
                            Try searching for something else, or create a new file.
                        </div>
                    )
                }
                icon={visual === "icon" ? icon : <Spinner size={iconSize} />}
                iconSize={iconSize}
                layout={layout}
                title={showTitle && "No search results"}
            />
        </Example>
    );
};

const sizeToNonIdealStateIconSize: Record<Size, NonIdealStateIconSize> = {
    large: NonIdealStateIconSize.STANDARD,
    regular: NonIdealStateIconSize.SMALL,
    small: NonIdealStateIconSize.EXTRA_SMALL,
};

const nonIdealStateIconSizeToSize: Record<NonIdealStateIconSize, Size> = Object.fromEntries(
    Object.entries(sizeToNonIdealStateIconSize).map(a => a.reverse()),
);

type NonIdealStateVisualKind = "icon" | "spinner";

interface NonIdealStateVisualSelectProps {
    onChange: (option: NonIdealStateVisualKind) => void;
    visual: NonIdealStateVisualKind;
}

/** Button radio group to switch between icon and spinner visuals. */
const NonIdealStateVisualSelect: React.FC<NonIdealStateVisualSelectProps> = ({
    onChange,
    visual,
}) => {
    const handleChange = useCallback(
        (value: string) => onChange(value as NonIdealStateVisualKind),
        [onChange],
    );
    return (
        <FormGroup label="Visual">
            <SegmentedControl
                fill={true}
                onValueChange={handleChange}
                options={[
                    { label: "Icon", value: "icon" },
                    { label: "Spinner", value: "spinner" },
                ]}
                size="small"
                value={visual}
            />
        </FormGroup>
    );
};
