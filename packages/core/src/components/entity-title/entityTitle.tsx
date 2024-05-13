/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { type IconName, IconNames } from "@blueprintjs/icons";

import { Classes, DISPLAYNAME_PREFIX, type MaybeElement, type Props } from "../../common";
import { H1, H2, H3, H4, H5, H6 } from "../html/html";
import { Icon } from "../icon/icon";
import { Text } from "../text/text";

export interface EntityTitleProps extends Props {
    /**
     * Whether the overflowing text content should be ellipsized.
     *
     * @default false
     */
    ellipsize?: boolean;

    /**
     * React component to render the main title heading. This defaults to
     * Blueprint's `<Text>` component, * which inherits font size from its
     * containing element(s).
     *
     * To render larger, more prominent titles, Use Blueprint's heading
     * components instead (e.g. `{ H1 } from "@blueprintjs/core"`).
     *
     * @default Text
     */
    heading?: React.FC<any>;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render in the section's header.
     * Note that the header will only be rendered if `title` is provided.
     */
    icon?: IconName | MaybeElement;

    /**
     * Whether to render as loading state.
     *
     * @default false
     */
    loading?: boolean;

    /** The content to render below the title. Defaults to render muted text. */
    subtitle?: React.JSX.Element | string;

    /** The primary title to render. */
    title: React.JSX.Element | string;

    /** If specified, the title will be wrapped in an anchor with this URL. */
    titleURL?: string;

    /**
     * <Tag> components work best - if multiple, wrap in <React.Fragment>
     */
    tags?: React.ReactNode;
}

/**
 * EntityTitle component.
 *
 * @see https://blueprintjs.com/docs/#core/components/entity-title
 */
export const EntityTitle: React.FC<EntityTitleProps> = React.forwardRef<HTMLDivElement, EntityTitleProps>(
    (props, ref) => {
        const {
            className,
            ellipsize = false,
            heading = Text,
            icon,
            loading = false,
            subtitle,
            tags,
            title,
            titleURL,
        } = props;

        const titleElement = React.useMemo(() => {
            const maybeTitleWithURL =
                titleURL != null ? (
                    <a target="_blank" href={titleURL} rel="noreferrer">
                        {title}
                    </a>
                ) : (
                    title
                );

            return React.createElement(
                heading,
                {
                    className: classNames(Classes.ENTITY_TITLE_TITLE, {
                        [Classes.SKELETON]: loading,
                        [Classes.TEXT_OVERFLOW_ELLIPSIS]: heading !== Text && ellipsize,
                    }),
                    ellipsize: heading === Text ? ellipsize : undefined,
                },
                maybeTitleWithURL,
            );
        }, [titleURL, title, heading, loading, ellipsize]);

        const maybeSubtitle = React.useMemo(() => {
            if (subtitle == null) {
                return null;
            }

            return (
                <Text
                    className={classNames(Classes.TEXT_MUTED, Classes.ENTITY_TITLE_SUBTITLE, {
                        [Classes.SKELETON]: loading,
                    })}
                    ellipsize={ellipsize}
                >
                    {subtitle}
                </Text>
            );
        }, [ellipsize, loading, subtitle]);

        return (
            <div
                className={classNames(className, Classes.ENTITY_TITLE, getClassNameFromHeading(heading), {
                    [Classes.ENTITY_TITLE_ELLIPSIZE]: ellipsize,
                })}
                ref={ref}
            >
                {icon != null && (
                    <div
                        className={classNames(Classes.ENTITY_TITLE_ICON_CONTAINER, {
                            [Classes.ENTITY_TITLE_HAS_SUBTITLE]: maybeSubtitle != null,
                        })}
                    >
                        <Icon
                            aria-hidden={true}
                            className={classNames(Classes.TEXT_MUTED, { [Classes.SKELETON]: loading })}
                            icon={loading ? IconNames.SQUARE : icon}
                            tabIndex={-1}
                        />
                    </div>
                )}
                <div className={Classes.ENTITY_TITLE_TEXT}>
                    <div
                        className={classNames(Classes.ENTITY_TITLE_TITLE_AND_TAGS, {
                            [Classes.SKELETON]: loading,
                        })}
                    >
                        {titleElement}
                        {tags != null && <div className={Classes.ENTITY_TITLE_TAGS_CONTAINER}>{tags}</div>}
                    </div>
                    {maybeSubtitle}
                </div>
            </div>
        );
    },
);
EntityTitle.displayName = `${DISPLAYNAME_PREFIX}.EntityTitle`;

/**
 * Construct header class name from H{*}. Returns `undefined` if `heading` is not a Blueprint heading.
 */
function getClassNameFromHeading(heading: React.FC<unknown>) {
    const headerIndex = [H1, H2, H3, H4, H5, H6].findIndex(header => header === heading);
    if (headerIndex < 0) {
        return undefined;
    }
    return [Classes.getClassNamespace(), "entity-title-heading", `h${headerIndex + 1}`].join("-");
}
