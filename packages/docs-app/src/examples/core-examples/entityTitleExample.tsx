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

export interface EntityTitleExampleState {
    ellipsize: boolean;
    heading: string;
    icon: boolean;
    loading: boolean;
    withSubtitle: boolean;
    withTag: boolean;
}

export class EntityTitleExample extends React.PureComponent<ExampleProps, EntityTitleExampleState> {
    public state: EntityTitleExampleState = {
        ellipsize: false,
        heading: "Default",
        icon: true,
        loading: false,
        withSubtitle: false,
        withTag: false,
    };

    private toggleEllipsize = handleBooleanChange((ellipsize: boolean) => this.setState({ ellipsize }));

    private toggleIcon = handleBooleanChange((icon: boolean) => this.setState({ icon }));

    private toggleLoading = handleBooleanChange((loading: boolean) => this.setState({ loading }));

    private toggleSubtitle = handleBooleanChange((withSubtitle: boolean) => this.setState({ withSubtitle }));

    private toggleTag = handleBooleanChange((withTag: boolean) => this.setState({ withTag }));

    private handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.setState({ heading: event.currentTarget.value });
    };

    public render() {
        const { ellipsize, heading, icon, loading, withSubtitle, withTag } = this.state;
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <div style={{ width: this.state.ellipsize ? WIDTH_LIMIT : undefined }}>
                    <EntityTitle
                        ellipsize={ellipsize}
                        heading={getHeading(heading)}
                        icon={icon ? IconNames.Circle : undefined}
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
    }

    private renderOptions() {
        return (
            <>
                <H5>Props</H5>
                <FormGroup label="Heading">
                    <ControlGroup>
                        <HTMLSelect
                            value={this.state.heading}
                            onChange={this.handleChange}
                            options={HEADINGS}
                            fill={true}
                        />
                    </ControlGroup>
                </FormGroup>
                <Switch checked={this.state.ellipsize} label="Ellipsize" onChange={this.toggleEllipsize} />
                <Switch checked={this.state.icon} label="Display icon" onChange={this.toggleIcon} />
                <Switch checked={this.state.loading} label="Loading" onChange={this.toggleLoading} />
                <Switch checked={this.state.withSubtitle} label="Display subtitle" onChange={this.toggleSubtitle} />
                <Switch checked={this.state.withTag} label="Display tag" onChange={this.toggleTag} />
            </>
        );
    }
}

// Limit width to display ellipsizing behavior.
const WIDTH_LIMIT = 200;

// Headings selector.
const HEADINGS = ["Default", "H1", "H2", "H3", "H4", "H5", "H6"].map(value => ({ label: value, value }));

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
