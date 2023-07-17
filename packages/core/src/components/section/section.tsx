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

import { Classes, Elevation, Utils } from "../../common";
import { DISPLAYNAME_PREFIX, HTMLDivProps, MaybeElement, Props } from "../../common/props";
import { Card } from "../card/card";
import { Collapse, CollapseProps } from "../collapse/collapse";
import { H6 } from "../html/html";
import { Icon } from "../icon/icon";

/**
 * Subset of {@link Elevation} options which are visually supported by the {@link Section} component.
 *
 * Note that an elevation greater than 1 creates too much visual clutter/noise in the UI, especially when
 * multiple Sections are shown on a single page.
 */
export type SectionElevation = typeof Elevation.ZERO | typeof Elevation.ONE;

export interface SectionProps extends Props, Omit<HTMLDivProps, "title">, React.RefAttributes<HTMLDivElement> {
    /**
     * Whether this section's contents should be collapsible.
     *
     * @default false
     */
    collapsible?: boolean;

    /**
     * Subset of props to forward to the underlying {@link Collapse} component, with the addition of a
     * `defaultIsOpen` option which sets the default open state of the component.
     *
     * This prop has no effect if `collapsible={false}`.
     */
    collapseProps?: Pick<CollapseProps, "className" | "keepChildrenMounted" | "transitionDuration"> & {
        defaultIsOpen?: boolean;
    };

    /**
     * Whether this section should use compact styles.
     *
     * @default false
     */
    compact?: boolean;

    /**
     * Visual elevation of this container element.
     *
     * @default Elevation.ZERO
     */
    elevation?: SectionElevation;

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
        collapseProps,
        collapsible,
        compact,
        elevation,
        icon,
        rightElement,
        subtitle,
        title,
        ...htmlProps
    } = props;
    const [isCollapsed, setIsCollapsed] = React.useState<boolean>(collapseProps?.defaultIsOpen ?? false);
    const toggleIsCollapsed = React.useCallback(() => setIsCollapsed(!isCollapsed), [isCollapsed]);

    const isHeaderLeftContainerVisible = title != null || icon != null || subtitle != null;
    const isHeaderRightContainerVisible = rightElement != null || collapsible;

    return (
        <Card
            className={classNames(className, Classes.SECTION, {
                [Classes.COMPACT]: compact,
                [Classes.SECTION_COLLAPSED]: (collapsible && isCollapsed) || Utils.isReactNodeEmpty(children),
            })}
            elevation={elevation}
            ref={ref}
            {...htmlProps}
        >
            <div
                role={collapsible ? "button" : undefined}
                aria-pressed={collapsible ? isCollapsed : undefined}
                className={classNames(Classes.SECTION_HEADER, {
                    [Classes.INTERACTIVE]: collapsible,
                })}
                onClick={collapsible != null ? toggleIsCollapsed : undefined}
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
                    </>
                )}

                {isHeaderRightContainerVisible && (
                    <div className={Classes.SECTION_HEADER_RIGHT}>
                        {rightElement}
                        {collapsible &&
                            (isCollapsed ? (
                                <ChevronDown className={Classes.TEXT_MUTED} />
                            ) : (
                                <ChevronUp className={Classes.TEXT_MUTED} />
                            ))}
                    </div>
                )}
            </div>

            {collapsible ? (
                <Collapse {...collapseProps} isOpen={!isCollapsed}>
                    {children}
                </Collapse>
            ) : (
                children
            )}
        </Card>
    );
});
Section.defaultProps = {
    compact: false,
    elevation: Elevation.ZERO,
};
Section.displayName = `${DISPLAYNAME_PREFIX}.Section`;
