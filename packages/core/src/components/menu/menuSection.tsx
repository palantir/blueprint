/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent, Classes } from "../../common";
import { Props } from "../../common/props";
import { H6 } from "../html/html";
import { MenuItem, MenuItemProps } from "./menuItem";

export type MenuSectionProps = IMenuSectionProps;

export type MenuItemPropsWithId = MenuItemProps & {
    /** Unique identifier */
    id: string;
};

export interface IMenuSectionProps extends Props, React.HTMLAttributes<HTMLUListElement> {
    /** Menu items */
    items: MenuItemPropsWithId[];

    /** Optional header title */
    sectionTitle?: React.ReactNode;
}

export class MenuSection extends AbstractPureComponent<MenuSectionProps> {
    public render() {
        const { items, className, sectionTitle, id } = this.props;
        const classes = classNames(Classes.MENU_SECTION, className);

        return (
            <div className={classes}>
                {sectionTitle && (
                    <div className={Classes.MENU_HEADER}>
                        <H6>{sectionTitle}</H6>
                    </div>
                )}
                {items.map(item => {
                    return <MenuItem key={id} {...item} />;
                })}
            </div>
        );
    }
}
