/* !
 * (c) Copyright 2023 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import * as React from "react";

import { IconName, IconNames } from "@blueprintjs/icons";

import { Classes, DISPLAYNAME_PREFIX, MaybeElement, Props } from "../../common";
import { H1, H2, H3, H4, H5, H6 } from "../html/html";
import { Icon } from "../icon/icon";
import { Text } from "../text/text";

export enum HeadingSize {
    h6 = "h6",
    h5 = "h5",
    h4 = "h4",
    h3 = "h3",
    h2 = "h2",
    h1 = "h1",
}

export type IEntityTitleProps = Props & {
    title: JSX.Element | string;

    /**
     * Inherit font size if not provided
     */
    headingSize?: HeadingSize;

    titleURL?: string;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render in the section's header.
     * Note that the header will only be rendered if `title` is provided.
     */
    icon?: IconName | MaybeElement;

    /**
     * <Tag> components work best - if multiple, wrap in <React.Fragment>
     */
    tags?: React.ReactNode;

    subtitle?: JSX.Element | string;
};

export const EntityTitle: React.FC<IEntityTitleProps> = ({
    className,
    headingSize,
    title,
    icon,
    tags,
    subtitle,
    titleURL,
}) => {
    const titleComponent = React.useMemo(() => {
        const maybeTitleWithURL =
            titleURL != null ? (
                <a target="_blank" href={titleURL} rel="noreferrer">
                    {title}
                </a>
            ) : (
                title
            );

        const titleClassName = classNames(Classes.ENTITY_TITLE_TITLE);

        switch (headingSize) {
            case HeadingSize.h1:
                return <H1 className={titleClassName}>{maybeTitleWithURL}</H1>;
            case HeadingSize.h2:
                return <H2 className={titleClassName}>{maybeTitleWithURL}</H2>;
            case HeadingSize.h3:
                return <H3 className={titleClassName}>{maybeTitleWithURL}</H3>;
            case HeadingSize.h4:
                return <H4 className={titleClassName}>{maybeTitleWithURL}</H4>;
            case HeadingSize.h5:
                return <H5 className={titleClassName}>{maybeTitleWithURL}</H5>;
            case HeadingSize.h6:
                return <H6 className={titleClassName}>{maybeTitleWithURL}</H6>;
            default:
                return <Text className={titleClassName}>{maybeTitleWithURL}</Text>;
        }
    }, [title, titleURL, headingSize]);

    const subtitleComponent = React.useMemo(() => {
        if (!subtitle) {
            return null;
        }

        return (
            <Text
                className={classNames(
                    Classes.TEXT_MUTED,
                    headingSize == null && Classes.TEXT_SMALL,
                    Classes.ENTITY_TITLE_SUBTITLE,
                )}
            >
                {subtitle}
            </Text>
        );
    }, [headingSize, subtitle]);

    return (
        <div className={classNames(className, Classes.ENTITY_TITLE, headingSize != null && css[headingSize])}>
            {icon != null && (
                <div
                    className={classNames(Classes.ENTITY_TITLE_ICON_CONTAINER, {
                        [Classes.ENTITY_TITLE_HAS_SUBTITLE]: subtitleComponent != null,
                    })}
                >
                    <Icon icon={icon} aria-hidden={true} tabIndex={-1} className={Classes.TEXT_MUTED} />
                </div>
            )}
            <div className={Classes.ENTITY_TITLE_RIGHT}>
                <div className={Classes.ENTITY_TITLE_TOP_LINE}>
                    {titleComponent}
                    {tags != null && <div className={Classes.ENTITY_TITLE_TAGS_CONTAINER}>{tags}</div>}
                </div>
                {subtitleComponent}
            </div>
        </div>
    );
};

EntityTitle.defaultProps = {};
EntityTitle.displayName = `${DISPLAYNAME_PREFIX}.EntityTitle`;

type ISkeletonEntityTitleProps = Props &
    Pick<IEntityTitleProps, "headingSize"> & {
        hasIcon?: boolean;
        hasSubtitle?: boolean;
    };

export const SkeletonEntityTitle: React.FC<ISkeletonEntityTitleProps> = ({ hasSubtitle, hasIcon, ...props }) => {
    return (
        <EntityTitle
            title={<span className={Classes.SKELETON}>xxxxxxxxxxxxxxxx</span>}
            icon={hasIcon ? <Icon icon={IconNames.SQUARE} className={Classes.SKELETON} /> : undefined}
            subtitle={hasSubtitle ? <span className={Classes.SKELETON}>xxxxxxxx</span> : undefined}
            {...props}
        />
    );
};

SkeletonEntityTitle.defaultProps = {};
SkeletonEntityTitle.displayName = `${DISPLAYNAME_PREFIX}.SleletonEntityTitle`;
