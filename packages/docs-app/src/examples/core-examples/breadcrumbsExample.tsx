/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Boundary, Breadcrumbs, Card, H5, IBreadcrumbProps, Label, RadioGroup, Slider } from "@blueprintjs/core";
import { Example, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface IBreadcrumbsExampleState {
    collapseFrom: Boundary;
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
    { icon: "document", text: "image.jpg" },
];

export class BreadcrumbsExample extends React.PureComponent<IExampleProps, IBreadcrumbsExampleState> {
    public state: IBreadcrumbsExampleState = {
        collapseFrom: Boundary.START,
        width: 50,
    };

    private handleChangeCollapse = handleStringChange((collapseFrom: Boundary) => this.setState({ collapseFrom }));

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

        const { collapseFrom, width } = this.state;
        return (
            <Example options={options} {...this.props}>
                <Card elevation={0} style={{ width: `${width}%` }}>
                    <Breadcrumbs collapseFrom={collapseFrom} items={ITEMS} />
                </Card>
            </Example>
        );
    }

    private renderLabel(value: number) {
        return `${value}%`;
    }

    private handleChangeWidth = (width: number) => this.setState({ width });
}
