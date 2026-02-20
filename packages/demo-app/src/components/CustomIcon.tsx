/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { forwardRef } from "react";

import { type IconName, type IntentProps, type Props, removeNonHTMLProps } from "@blueprintjs/core";
import { IconSize, SVGIconContainer, type SVGIconProps } from "@blueprintjs/icons";

export interface CustomIconData {
    isActive: boolean;
    name: string;
    originalViewBox: string;
    paths: string[];
}

export type CustomIconProps<T extends Element = Element> = IntentProps &
    Props &
    SVGIconProps<T> & {
        customIconData: CustomIconData;
    };

/**
 * Custom icon component that wraps SVGIconContainer and properly forwards className
 * to ensure it works correctly with Blueprint components like Button, Tab, MenuItem, etc.
 */
export const CustomIcon = forwardRef(<T extends Element>(props: CustomIconProps<T>, ref: React.Ref<T>) => {
    const {
        className,
        color,
        customIconData,
        intent,
        tagName = "span",
        svgProps,
        title,
        htmlTitle,
        ...htmlProps
    } = props;

    const size = props.size ?? IconSize.STANDARD;
    const pathElements = customIconData.paths.map((d, i) => <path d={d} key={i} />);

    return (
        <SVGIconContainer<any>
            children={pathElements}
            className={className}
            color={color}
            htmlTitle={htmlTitle}
            iconName={customIconData.name as IconName}
            ref={ref}
            size={size}
            svgProps={{ ...svgProps, viewBox: customIconData.originalViewBox } as React.SVGAttributes<SVGElement>}
            tagName={tagName}
            title={title}
            {...removeNonHTMLProps(htmlProps)}
        />
    );
}) as any;

CustomIcon.displayName = "CustomIcon";
