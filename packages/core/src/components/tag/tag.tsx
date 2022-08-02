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

import {
    AbstractPureComponent2,
    Classes,
    DISPLAYNAME_PREFIX,
    IElementRefProps,
    IntentProps,
    MaybeElement,
    Props,
    Utils,
} from "../../common";
import { isReactNodeEmpty } from "../../common/utils";
import { Icon, IconName, IconSize } from "../icon/icon";
import { Text } from "../text/text";

// eslint-disable-next-line deprecation/deprecation
export type TagProps = ITagProps;
/** @deprecated use TagProps */
export interface ITagProps
    extends Props,
        IntentProps,
        // eslint-disable-next-line deprecation/deprecation
        IElementRefProps<HTMLSpanElement>,
        React.HTMLAttributes<HTMLSpanElement> {
    /**
     * Whether the tag should appear in an active state.
     *
     * @default false
     */
    active?: boolean;

    children?: React.ReactNode;

    /**
     * Whether the tag should take up the full width of its container.
     *
     * @default false
     */
    fill?: boolean;

    /** Name of a Blueprint UI icon (or an icon element) to render before the children. */
    icon?: IconName | MaybeElement;

    /**
     * Whether the tag should visually respond to user interactions. If set
     * to `true`, hovering over the tag will change its color and mouse cursor.
     *
     * Recommended when `onClick` is also defined.
     *
     * @default false
     */
    interactive?: boolean;

    /**
     * Whether this tag should use large styles.
     *
     * @default false
     */
    large?: boolean;

    /**
     * Whether this tag should use minimal styles.
     *
     * @default false
     */
    minimal?: boolean;

    /**
     * Whether tag content should be allowed to occupy multiple lines.
     * If false, a single line of text will be truncated with an ellipsis if
     * it overflows. Note that icons will be vertically centered relative to
     * multiline text.
     *
     * @default false
     */
    multiline?: boolean;

    /**
     * Callback invoked when the tag is clicked.
     * Recommended when `interactive` is `true`.
     */
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;

    /**
     * Click handler for remove button.
     * The remove button will only be rendered if this prop is defined.
     */
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>, tagProps: TagProps) => void;

    /** Name of a Blueprint UI icon (or an icon element) to render after the children. */
    rightIcon?: IconName | MaybeElement;

    /**
     * Whether this tag should have rounded ends.
     *
     * @default false
     */
    round?: boolean;

    /**
     * HTML title to be passed to the <Text> component
     */
    htmlTitle?: string;
}

export class Tag extends AbstractPureComponent2<TagProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Tag`;

    public render() {
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
            elementRef,
            ...htmlProps
        } = this.props;
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
        const isLarge = large || tagClasses.indexOf(Classes.LARGE) >= 0;
        const removeButton = isRemovable ? (
            <button
                aria-label="Remove Tag"
                type="button"
                className={Classes.TAG_REMOVE}
                onClick={this.onRemoveClick}
                tabIndex={interactive ? tabIndex : undefined}
            >
                <Icon icon="small-cross" size={isLarge ? IconSize.LARGE : IconSize.STANDARD} />
            </button>
        ) : null;

        return (
            <span {...htmlProps} className={tagClasses} tabIndex={interactive ? tabIndex : undefined} ref={elementRef}>
                <Icon icon={icon} />
                {!isReactNodeEmpty(children) && (
                    <Text className={Classes.FILL} ellipsize={!multiline} tagName="span" title={htmlTitle}>
                        {children}
                    </Text>
                )}
                <Icon icon={rightIcon} />
                {removeButton}
            </span>
        );
    }

    private onRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onRemove?.(e, this.props);
    };
}
