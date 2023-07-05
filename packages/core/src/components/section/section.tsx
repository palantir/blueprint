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

import classNames from "classnames";
import * as React from "react";

import { ChevronDown, ChevronUp, IconName } from "@blueprintjs/icons";

import { Classes, Elevation } from "../../common";
import { DISPLAYNAME_PREFIX, HTMLDivProps, MaybeElement, Props } from "../../common/props";
import { Card } from "../card/card";
import { Divider } from "../divider/divider";
import { H6 } from "../html/html";
import { Icon } from "../icon/icon";
import { Tab, TabId, TabProps } from "../tabs/tab";
import { Tabs, TabsProps } from "../tabs/tabs";

export interface SectionProps extends Props, Omit<HTMLDivProps, "title">, React.RefAttributes<HTMLDivElement> {
    /**
     * Whether this section's contents should be collapsible.
     *
     * @default false
     */
    collapsible?: boolean;

    /**
     * If `collapsible={true}`, this sets the default open state of the `<Collapse>` contents.
     *
     * @default false
     */
    collapsedByDefault?: boolean;

    /**
     * Whether this section should use compact styles.
     *
     * @default false
     */
    compact?: boolean;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render in the section's header.
     * Note that the header will only be rendered if `title` is provided.
     */
    icon?: IconName | MaybeElement;

    /**
     * Element to render on the right side of the section header.
     */
    rightElement?: JSX.Element;

    /**
     * Sub-title of the section.
     * Note that the header will only be rendered if `title` is provided.
     */
    subtitle?: JSX.Element | string;

    /**
     * Use tabs to define the content. If enabled, children will be ignored.
     */
    tabDefinitions?: TabProps[];

    /**
     * Subset of props to forward to the `<Tabs>` component.
     * Note that tabs will only be rendered if `tabDefinitions` is provided.
     */
    tabsProps?: Omit<TabsProps, "vertical" | "children" | "large" | "fill" | "id">;

    /**
     * Title of the section.
     * Note that the header will only be rendered if `title` is provided.
     */
    title?: JSX.Element | string;
}

/**
 * Section component.
 *
 * @see https://blueprintjs.com/docs/#core/components/section
 */
export const Section: React.FC<SectionProps> = React.forwardRef((props, ref) => {
    const {
        children,
        className,
        collapsedByDefault,
        collapsible,
        compact,
        icon,
        rightElement,
        subtitle,
        tabDefinitions,
        tabsProps,
        title,
        ...cardProps
    } = props;
    const classes = classNames(Classes.SECTION, { [Classes.COMPACT]: compact }, className);

    const controlledSelectedTabId = tabsProps?.selectedTabId;
    const [selectedTabId, setSelectedTabId] = React.useState<TabId | undefined>(tabsProps?.defaultSelectedTabId);

    const [collapsed, setCollapsed] = React.useState<boolean | undefined>(collapsedByDefault ?? false);
    const toggleCollapsed = React.useCallback(() => setCollapsed(!collapsed), [collapsed]);
    const showContent = React.useMemo(() => {
        if (collapsible && collapsed) {
            return false;
        }

        return true;
    }, [collapsible, collapsed]);

    const maybeActiveTabPanel: JSX.Element | undefined = tabDefinitions?.find(tab =>
        controlledSelectedTabId != null ? tab.id === controlledSelectedTabId : tab.id === selectedTabId,
    )?.panel;

    const isHeaderLeftContainerVisible = title != null || icon != null || subtitle != null;
    const isHeaderRightContainerVisible = rightElement != null || collapsible;

    return (
        <Card elevation={Elevation.ZERO} className={classes} ref={ref} {...cardProps}>
            <div
                role={collapsible ? "button" : undefined}
                aria-pressed={collapsible ? collapsed : undefined}
                className={classNames(Classes.SECTION_HEADER, {
                    [Classes.INTERACTIVE]: collapsible,
                    [Classes.COLLAPSED]: !showContent,
                })}
                onClick={collapsible != null ? toggleCollapsed : undefined}
            >
                {isHeaderLeftContainerVisible && (
                    <>
                        <div className={Classes.SECTION_HEADER_LEFT}>
                            {title && icon && (
                                <Icon icon={icon} aria-hidden={true} tabIndex={-1} className={Classes.TEXT_MUTED} />
                            )}

                            <div>
                                {title && <H6 className={Classes.SECTION_HEADER_TITLE}>{title}</H6>}
                                {title && subtitle && (
                                    <div className={classNames(Classes.TEXT_MUTED, Classes.SECTION_HEADER_SUB_TITLE)}>
                                        {subtitle}
                                    </div>
                                )}
                            </div>
                        </div>

                        {tabDefinitions && isHeaderRightContainerVisible && (
                            <Divider className={Classes.SECTION_HEADER_DIVIDER} />
                        )}
                    </>
                )}

                {tabDefinitions && (
                    <div className={Classes.SECTION_HEADER_TABS}>
                        <Tabs selectedTabId={selectedTabId} onChange={setSelectedTabId} fill={true} {...tabsProps}>
                            {tabDefinitions.map(tabDefinition => (
                                <Tab key={tabDefinition.id} {...tabDefinition} panel={undefined} />
                            ))}
                        </Tabs>
                    </div>
                )}

                {isHeaderRightContainerVisible && (
                    <div className={Classes.SECTION_HEADER_RIGHT}>
                        {rightElement}
                        {collapsible &&
                            (collapsed ? (
                                <ChevronDown className={Classes.TEXT_MUTED} />
                            ) : (
                                <ChevronUp className={Classes.TEXT_MUTED} />
                            ))}
                    </div>
                )}
            </div>
            {showContent && (maybeActiveTabPanel ?? children)}
        </Card>
    );
});
Section.defaultProps = {
    collapsedByDefault: false,
    compact: false,
};
Section.displayName = `${DISPLAYNAME_PREFIX}.Section`;
