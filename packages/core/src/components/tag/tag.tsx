/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

export interface TagProps
    extends Props,
        IntentProps,
        TagSharedProps,
        React.RefAttributes<HTMLSpanElement>,
        React.HTMLAttributes<HTMLSpanElement> {
    /**
     * Child nodes which will be rendered inside a `<Text>` element.
     */
    children?: React.ReactNode;

    /**
     * HTML title to be passed to the <Text> component
     */
    htmlTitle?: string;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render on the left side of the tag,
     * before the child nodes.
     */
    icon?: IconName | MaybeElement;

    /**
     * Whether tag content should be allowed to occupy multiple lines.
     * If `false`, a single line of text will be truncated with an ellipsis if it overflows.
     * Note that icons will be vertically centered relative to multiline text.
     *
     * @default false
     */
    multiline?: boolean;

    /**
     * Click handler for remove button.
     * The remove button will only be rendered if this prop is defined.
     */
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>, tagProps: TagProps) => void;
}

/**
 * Tag component.
 *
 * @see https://blueprintjs.com/docs/#core/components/tag
 */
export const Tag: React.FC<TagProps> = React.forwardRef((props, ref) => {
    const {
        active,
        children,
        className,
        fill,
        icon,
        intent,
        interactive,
        large,
        minimal,
        multiline,
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
        <span {...htmlProps} className={tagClasses} tabIndex={interactive ? tabIndex : undefined} ref={ref}>
            <Icon icon={icon} />
            {!isReactNodeEmpty(children) && (
                <Text className={Classes.FILL} ellipsize={!multiline} tagName="span" title={htmlTitle}>
                    {children}
                </Text>
            )}
            <Icon icon={rightIcon} />
            {isRemovable && <TagRemoveButton {...props} />}
        </span>
    );
});
Tag.defaultProps = {
    active: false,
    fill: false,
    interactive: false,
    large: false,
    minimal: false,
    round: false,
};
Tag.displayName = `${DISPLAYNAME_PREFIX}.Tag`;
