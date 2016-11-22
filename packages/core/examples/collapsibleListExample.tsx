/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import BaseExample, { handleNumberChange } from "./common/baseExample";
import {
    Classes,
    CollapseFrom,
    CollapsibleList,
    IMenuItemProps,
    MenuItem,
    RadioGroup,
    Slider,
} from "@blueprintjs/core";

export interface ICollapsibleListExampleState {
    collapseFrom?: CollapseFrom;
    visibleItemCount?: number;
}

const COLLAPSE_FROM_RADIOS = [
    { className: Classes.INLINE, label: "Start", value: CollapseFrom.START.toString() },
    { className: Classes.INLINE, label: "End", value: CollapseFrom.END.toString() },
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
                className={Classes.BREADCRUMBS}
                dropdownTarget={<span className={Classes.BREADCRUMBS_COLLAPSED} />}
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
                <label className={Classes.LABEL} key="visible-label">Visible items</label>,
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
            return <a className={Classes.BREADCRUMB}>{props.text}</a>;
        } else {
            return <span className={classNames(Classes.BREADCRUMB, Classes.BREADCRUMB_CURRENT)}>{props.text}</span>;
        }
    }

    private handleChangeCount = (visibleItemCount: number) => this.setState({ visibleItemCount });
}
