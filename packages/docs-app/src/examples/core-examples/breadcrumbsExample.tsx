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

/* eslint-disable max-classes-per-file */

import * as React from "react";

import {
    Boundary,
    Breadcrumbs,
    Card,
    Checkbox,
    H5,
    IBreadcrumbProps,
    InputGroup,
    Label,
    RadioGroup,
    Slider,
} from "@blueprintjs/core";
import { Example, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface IBreadcrumbsExampleState {
    collapseFrom: Boundary;
    renderCurrentAsInput: boolean;
    width: number;
}

const COLLAPSE_FROM_RADIOS = [
    { label: "Start", value: Boundary.START.toString() },
    { label: "End", value: Boundary.END.toString() },
];

const ITEMS: IBreadcrumbProps[] = [
    { icon: "folder-close", text: "All files" },
    { icon: "folder-close", text: "Users" },
    { icon: "folder-close", text: "Janet" },
    { href: "#", icon: "folder-close", text: "Photos" },
    { href: "#", icon: "folder-close", text: "Wednesday" },
    { icon: "document", text: "image.jpg", current: true },
];

export class BreadcrumbsExample extends React.PureComponent<IExampleProps, IBreadcrumbsExampleState> {
    public state: IBreadcrumbsExampleState = {
        collapseFrom: Boundary.START,
        renderCurrentAsInput: false,
        width: 50,
    };

    private handleChangeCollapse = handleStringChange(collapseFrom =>
        this.setState({ collapseFrom: collapseFrom as Boundary }),
    );

    public render() {
        const options = (
            <>
                <H5>Props</H5>
                <RadioGroup
                    name="collapseFrom"
                    inline={true}
                    label="Collapse from"
                    onChange={this.handleChangeCollapse}
                    options={COLLAPSE_FROM_RADIOS}
                    selectedValue={this.state.collapseFrom.toString()}
                />
                <Checkbox
                    name="renderCurrent"
                    label="Render current breadcrumb as input"
                    onChange={this.handleChangeRenderCurrentAsInput}
                    checked={this.state.renderCurrentAsInput}
                />
                <H5>Example</H5>
                <Label>Width</Label>
                <Slider
                    labelRenderer={this.renderLabel}
                    labelStepSize={50}
                    max={100}
                    onChange={this.handleChangeWidth}
                    showTrackFill={false}
                    value={this.state.width}
                />
            </>
        );

        const { collapseFrom, renderCurrentAsInput, width } = this.state;
        return (
            <Example options={options} {...this.props}>
                <Card elevation={0} style={{ width: `${width}%` }}>
                    <Breadcrumbs
                        collapseFrom={collapseFrom}
                        items={ITEMS}
                        currentBreadcrumbRenderer={renderCurrentAsInput ? this.renderBreadcrumbInput : undefined}
                    />
                </Card>
            </Example>
        );
    }

    private renderLabel = (value: number) => {
        return `${value}%`;
    };

    private handleChangeWidth = (width: number) => this.setState({ width });

    private handleChangeRenderCurrentAsInput = () =>
        this.setState({ renderCurrentAsInput: !this.state.renderCurrentAsInput });

    private renderBreadcrumbInput = ({ text }: IBreadcrumbProps) => {
        return <BreadcrumbInput defaultValue={typeof text === "string" ? text : undefined} />;
    };
}

/* eslint-disable  max-classes-per-file */
class BreadcrumbInput extends React.PureComponent<IBreadcrumbProps & { defaultValue: string | undefined }> {
    public state = {
        text: this.props.defaultValue ?? "",
    };

    public render() {
        const { text } = this.state;
        return <InputGroup placeholder="rename me" value={text} onChange={this.handleChange} />;
    }

    private handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            text: (event.target as HTMLInputElement).value,
        });
    };
}
