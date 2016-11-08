/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import {
    CollapseFrom,
    CollapsibleList,
    IMenuItemProps,
    MenuItem,
    RadioGroup,
    Slider,
} from "../src";
import BaseExample, { handleNumberChange } from "./common/baseExample";

export interface ICollapsibleListExampleState {
    collapseFrom?: CollapseFrom;
    visibleItemCount?: number;
}

const COLLAPSE_FROM_RADIOS = [
    { className: "pt-inline", label: "Start", value: CollapseFrom.START.toString() },
    { className: "pt-inline", label: "End", value: CollapseFrom.END.toString() },
];

export class CollapsibleListExample extends BaseExample<ICollapsibleListExampleState> {
    public state: ICollapsibleListExampleState = {
        collapseFrom: CollapseFrom.START,
        visibleItemCount: 3,
    };

    private handleChangeCollapse = handleNumberChange((collapseFrom) => this.setState({ collapseFrom }));

    protected renderExample() {
        return (
            <CollapsibleList
                {...this.state}
                className="pt-breadcrumbs"
                dropdownTarget={<span className="pt-breadcrumbs-collapsed" />}
                renderVisibleItem={this.renderBreadcrumb}
            >
                <MenuItem iconName="folder-close" text="All Files" href="#" />
                <MenuItem iconName="folder-close" text="Users" href="#" />
                <MenuItem iconName="folder-close" text="Jane Person" href="#" />
                <MenuItem iconName="folder-close" text="My Documents" href="#" />
                <MenuItem iconName="folder-close" text="Classy Dayjob" href="#" />
                <MenuItem iconName="document" text="How to crush it" />
            </CollapsibleList>
        );
    }

    protected renderOptions() {
        return [
            [
                <label className="pt-label" key="visible-label">Visible items</label>,
                <Slider
                    key="visible"
                    max={6}
                    onChange={this.handleChangeCount}
                    showTrackFill={false}
                    value={this.state.visibleItemCount}
                />,
           ], [
                <RadioGroup
                    key="collapseFrom"
                    name="collapseFrom"
                    label="Collapse from"
                    onChange={this.handleChangeCollapse}
                    options={COLLAPSE_FROM_RADIOS}
                    selectedValue={this.state.collapseFrom.toString()}
                />,
            ],
        ];
    }

    private renderBreadcrumb(props: IMenuItemProps) {
        if (props.href != null) {
            return <a className="pt-breadcrumb">{props.text}</a>;
        } else {
            return <span className="pt-breadcrumb pt-breadcrumb-current">{props.text}</span>;
        }
    }

    private handleChangeCount = (visibleItemCount: number) => this.setState({ visibleItemCount });
}
