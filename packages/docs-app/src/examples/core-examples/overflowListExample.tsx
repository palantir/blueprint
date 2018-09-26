/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import {
    Boundary,
    Breadcrumb,
    Card,
    Classes,
    H5,
    IMenuItemProps,
    Label,
    Menu,
    MenuItem,
    OverflowList,
    Popover,
    Position,
    RadioGroup,
    Slider,
} from "@blueprintjs/core";
import { Example, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface IOverflowListExampleState {
    collapseFrom: Boundary;
    width: number;
}

const COLLAPSE_FROM_RADIOS = [
    { label: "Start", value: Boundary.START.toString() },
    { label: "End", value: Boundary.END.toString() },
];

const ITEMS: IMenuItemProps[] = [
    { href: "#", icon: "folder-close", text: "All files" },
    { href: "#", icon: "folder-close", text: "Users" },
    { href: "#", icon: "folder-close", text: "Janet" },
    { href: "#", icon: "folder-close", text: "Photos" },
    { href: "#", icon: "folder-close", text: "Wednesday" },
    { icon: "document", text: "image.jpg" },
];

export class OverflowListExample extends React.PureComponent<IExampleProps, IOverflowListExampleState> {
    public state: IOverflowListExampleState = {
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
                    <OverflowList
                        className={Classes.BREADCRUMBS}
                        collapseFrom={collapseFrom}
                        items={ITEMS}
                        overflowRenderer={this.renderOverflow}
                        visibleItemRenderer={this.renderBreadcrumb}
                    />
                </Card>
            </Example>
        );
    }

    private renderLabel(value: number) {
        return `${value}%`;
    }

    private renderBreadcrumb(props: IMenuItemProps, index: number) {
        if (props.href != null) {
            return (
                <li key={index}>
                    <Breadcrumb {...props} />
                </li>
            );
        } else {
            return (
                <li className={classNames(Classes.BREADCRUMB, Classes.BREADCRUMB_CURRENT)} key={index}>
                    {props.text}
                </li>
            );
        }
    }

    private renderOverflow = (items: IMenuItemProps[]) => {
        const { collapseFrom } = this.state;
        const position = collapseFrom === Boundary.END ? Position.BOTTOM_RIGHT : Position.BOTTOM_LEFT;
        let orderedItems = items;
        if (this.state.collapseFrom === Boundary.START) {
            orderedItems = items.slice().reverse();
        }
        const menuItems = orderedItems.map((item, index) => <MenuItem {...item} key={index} />);
        return (
            <li>
                <Popover position={position}>
                    <span className={Classes.BREADCRUMBS_COLLAPSED} />
                    <Menu>{menuItems}</Menu>
                </Popover>
            </li>
        );
    };

    private handleChangeWidth = (width: number) => this.setState({ width });
}
