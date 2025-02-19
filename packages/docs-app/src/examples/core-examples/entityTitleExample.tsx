/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";

import {
    ControlGroup,
    EntityTitle,
    FormGroup,
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    HTMLSelect,
    Intent,
    Switch,
    Tag,
    Text,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

// Limit width to display ellipsizing behavior.
const WIDTH_LIMIT = 200;

// Headings selector.
const HEADINGS = ["Default", "H1", "H2", "H3", "H4", "H5", "H6"].map(value => ({ label: value, value }));

export const EntityTitleExample: React.FC<ExampleProps> = props => {
    const [ellipsize, setEllipsize] = React.useState<boolean>(false);
    const [fill, setFill] = React.useState<boolean>(false);
    const [heading, setHeading] = React.useState<string>("Default");
    const [icon, setIcon] = React.useState<boolean>(true);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [withSubtitle, setWithSubtitle] = React.useState<boolean>(false);
    const [withTag, setWithTag] = React.useState<boolean>(false);

    const handleHeadingChange = (event: React.FormEvent<HTMLSelectElement>) => {
        setHeading(event.currentTarget.value);
    };

    const options = (
        <>
            <H5>Props</H5>
            <FormGroup label="Heading">
                <ControlGroup>
                    <HTMLSelect value={heading} onChange={handleHeadingChange} options={HEADINGS} fill={true} />
                </ControlGroup>
            </FormGroup>
            <Switch checked={ellipsize} label="Ellipsize" onChange={handleBooleanChange(setEllipsize)} />
            <Switch checked={fill} label="Fill" onChange={handleBooleanChange(setFill)} />
            <Switch checked={icon} label="Display icon" onChange={handleBooleanChange(setIcon)} />
            <Switch checked={loading} label="Loading" onChange={handleBooleanChange(setLoading)} />
            <Switch checked={withSubtitle} label="Display subtitle" onChange={handleBooleanChange(setWithSubtitle)} />
            <Switch checked={withTag} label="Display tag" onChange={handleBooleanChange(setWithTag)} />
        </>
    );

    let width;
    if (ellipsize) {
        width = WIDTH_LIMIT;
    } else if (fill) {
        width = "100%";
    }

    return (
        <Example options={options} {...props}>
            <div style={{ width }}>
                <EntityTitle
                    ellipsize={ellipsize}
                    fill={fill}
                    heading={getHeading(heading)}
                    icon={icon ? IconNames.Shop : undefined}
                    loading={loading}
                    title="Buy groceries on my way home"
                    subtitle={withSubtitle ? "Reminder set for today at 6:00 PM" : undefined}
                    tags={
                        withTag ? (
                            <Tag intent={Intent.DANGER} minimal={true}>
                                Due today
                            </Tag>
                        ) : undefined
                    }
                />
            </div>
        </Example>
    );
};

function getHeading(heading: string): React.FC<any> {
    switch (heading) {
        case "H1":
            return H1;
        case "H2":
            return H2;
        case "H3":
            return H3;
        case "H4":
            return H4;
        case "H5":
            return H5;
        case "H6":
            return H6;
        default:
            return Text;
    }
}
