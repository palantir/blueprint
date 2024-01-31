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

import type { IconName } from "@blueprintjs/icons";

import { Classes, DISPLAYNAME_PREFIX, type IntentProps, type MaybeElement, type Props, Utils } from "../../common";
import { isReactNodeEmpty } from "../../common/utils";
import { Icon } from "../icon/icon";
import { Text } from "../text/text";

import { TagRemoveButton } from "./tagRemoveButton";
import type { TagSharedProps } from "./tagSharedProps";

export interface CompoundTagProps
    extends Props,
        IntentProps,
        TagSharedProps,
        React.RefAttributes<HTMLSpanElement>,
        React.HTMLAttributes<HTMLSpanElement> {
    /**
     * Child nodes which will be rendered on the right side of the tag, as the "value" in a key-value pair.
     */
    children?: React.ReactNode;

    /**
     * HTML title to be passed to the <Text> component
     */
    htmlTitle?: string;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render on the left side of the tag, inside
     * the "key" in a key-value pair.
     */
    icon?: IconName | MaybeElement;

    /**
     * Child nodes to be rendered on the left side of the tag, as the "key" in a key-value pair.
     */
    leftContent?: React.ReactNode;

    /**
     * Click handler for remove button.
     * The remove button will only be rendered if this prop is defined.
     */
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>, tagProps: CompoundTagProps) => void;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render on the right side of the tag, inside
     * the "value" in a key-value pair
     */
    rightIcon?: IconName | MaybeElement;
}

/**
 * Compound tag component.
 *
 * @see https://blueprintjs.com/docs/#core/components/compound-tag
 */
export const CompoundTag: React.FC<CompoundTagProps> = React.forwardRef((props, ref) => {
    const {
        active,
        children,
        className,
        fill,
        icon,
        intent,
        interactive,
        leftContent,
        large,
        minimal,
        onRemove,
        rightIcon,
        round,
        tabIndex = 0,
        htmlTitle,
        ...htmlProps
    } = props;

    const isRemovable = Utils.isFunction(onRemove);

    const tagClasses = classNames(
        Classes.TAG,
        Classes.COMPOUND_TAG,
        Classes.intentClass(intent),
        {
            [Classes.ACTIVE]: active,
            [Classes.FILL]: fill,
            [Classes.INTERACTIVE]: interactive,
            [Classes.LARGE]: large,
            [Classes.MINIMAL]: minimal,
            [Classes.ROUND]: round,
        },
        className,
    );

    return (
        <span
            {...htmlProps}
            className={tagClasses}
            tabIndex={interactive ? tabIndex : undefined}
            title={htmlTitle}
            ref={ref}
        >
            <span className={Classes.COMPOUND_TAG_LEFT}>
                <Icon icon={icon} />
                <Text className={classNames(Classes.COMPOUND_TAG_LEFT_CONTENT, Classes.FILL)} tagName="span">
                    {leftContent}
                </Text>
            </span>
            <span className={Classes.COMPOUND_TAG_RIGHT}>
                {!isReactNodeEmpty(children) && (
                    <Text className={classNames(Classes.COMPOUND_TAG_RIGHT_CONTENT, Classes.FILL)} tagName="span">
                        {children}
                    </Text>
                )}
                <Icon icon={rightIcon} />
                {isRemovable && <TagRemoveButton {...props} />}
            </span>
        </span>
    );
});
CompoundTag.displayName = `${DISPLAYNAME_PREFIX}.CompoundTag`;
