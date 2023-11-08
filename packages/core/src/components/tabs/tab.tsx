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

import type { IconName } from "@blueprintjs/icons";

import { AbstractPureComponent, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, type HTMLDivProps, type MaybeElement, type Props } from "../../common/props";
import type { TagProps } from "../tag/tag";

export type TabId = string | number;

export interface TabProps extends Props, Omit<HTMLDivProps, "id" | "title" | "onClick"> {
    /**
     * Content of tab title, rendered in a list above the active panel.
     * Can also be set via the `title` prop.
     */
    children?: React.ReactNode;

    /**
     * Whether the tab is disabled.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Unique identifier used to control which tab is selected
     * and to generate ARIA attributes for accessibility.
     */
    id: TabId;

    /**
     * Panel content, rendered by the parent `Tabs` when this tab is active.
     * If omitted, no panel will be rendered for this tab.
     */
    panel?: JSX.Element;

    /**
     * Space-delimited string of class names applied to tab panel container.
     */
    panelClassName?: string;

    /**
     * Content of tab title element, rendered in a list above the active panel.
     * Can also be set via React `children`.
     */
    title?: React.ReactNode;

    /** Name of a Blueprint UI icon (or an icon element) to render before the children. */
    icon?: IconName | MaybeElement;

    /**
     * Content to render inside a `<Tag>` after the children.
     * The tag is `minimal` by default; it can be further modified by using `tagProps`.
     */
    tagContent?: TagProps["children"];

    /**
     * Props to customize the `<Tag>` rendered after the children.
     * This has no effect if `tagContent` is `undefined`.
     */
    tagProps?: Omit<TagProps, "children">;
}

/**
 * Tab component.
 *
 * @see https://blueprintjs.com/docs/#core/components/tabs.tab
 */
export class Tab extends AbstractPureComponent<TabProps> {
    public static defaultProps: Partial<TabProps> = {
        disabled: false,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.Tab`;

    // this component is never rendered directly; see Tabs#renderTabPanel()
    /* istanbul ignore next */
    public render() {
        const { className, panel } = this.props;
        return (
            <div className={classNames(Classes.TAB_PANEL, className)} role="tablist">
                {panel}
            </div>
        );
    }
}
