/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { Boundary } from "../../common/boundary";
import * as Classes from "../../common/classes";
import { Position } from "../../common/position";
import { IProps } from "../../common/props";
import { Menu } from "../menu/menu";
import { MenuItem } from "../menu/menuItem";
import { OverflowList } from "../overflow-list/overflowList";
import { Popover } from "../popover/popover";
import { Breadcrumb, IBreadcrumbProps } from "./breadcrumb";

export interface IBreadcrumbsProps extends IProps {
    items: IBreadcrumbProps[];
    collapseFrom?: Boundary;
    breadcrumbRenderer?(props: IBreadcrumbProps): React.ReactNode;
    currentBreadcrumbRenderer?(props: IBreadcrumbProps): React.ReactNode;
}

export class Breadcrumbs extends React.PureComponent<IBreadcrumbsProps> {
    public render() {
        return (
            <OverflowList
                className={classNames(this.props.className, Classes.BREADCRUMBS)}
                collapseFrom={this.props.collapseFrom}
                items={this.props.items}
                overflowRenderer={this.renderOverflow}
                visibleItemRenderer={this.renderBreadcrumbWrapper}
            />
        );
    }

    private renderOverflow = (items: IBreadcrumbProps[]) => {
        const { collapseFrom } = this.props;
        const position = collapseFrom === Boundary.END ? Position.BOTTOM_RIGHT : Position.BOTTOM_LEFT;
        let orderedItems = items;
        if (collapseFrom === Boundary.START) {
            orderedItems = items.slice().reverse();
        }
        const menuItems = orderedItems.map((item, index) => <MenuItem {...item} text={item.text} key={index} />);
        return (
            <li>
                <Popover position={position}>
                    <span className={Classes.BREADCRUMBS_COLLAPSED} />
                    <Menu>{menuItems}</Menu>
                </Popover>
            </li>
        );
    };

    private renderBreadcrumbWrapper = (props: IBreadcrumbProps, index: number) => {
        const isCurrent = this.props.items[this.props.items.length - 1] === props;
        return <li key={index}>{this.renderBreadcrumb(props, isCurrent)}</li>;
    };

    private renderBreadcrumb(props: IBreadcrumbProps, isCurrent: boolean) {
        if (isCurrent && this.props.currentBreadcrumbRenderer != null) {
            return this.props.currentBreadcrumbRenderer(props);
        } else if (this.props.breadcrumbRenderer != null) {
            return this.props.breadcrumbRenderer(props);
        } else {
            return <Breadcrumb {...props} current={isCurrent} />;
        }
    }
}
