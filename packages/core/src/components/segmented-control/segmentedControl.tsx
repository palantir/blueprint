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

import { Classes, Intent } from "../../common";
import { DISPLAYNAME_PREFIX, type HTMLDivProps, type Props, removeNonHTMLProps } from "../../common/props";
import { Button } from "../button/buttons";

/**
 * SegmentedControl component props.
 */
export interface SegmentedControlProps<T extends string>
    extends Props,
        HTMLDivProps,
        React.RefAttributes<HTMLDivElement> {
    options: Array<{
        id: T;
        label: string;
    }>;
    defaultActiveOptionId?: T;
    onActiveOptionChange?: (activeOptionId: T | undefined) => void;
    intent?: typeof Intent.NONE | typeof Intent.PRIMARY;
}

/**
 * Segmented control component.
 *
 * @see https://blueprintjs.com/docs/#core/components/segmented-control
 */
export const SegmentedControl: React.FC<SegmentedControlProps<string>> = React.forwardRef((props, ref) => {
    const { className, options, defaultActiveOptionId, intent, onActiveOptionChange, ...htmlProps } = props;

    const [activeOptionId, setActiveOptionId] = React.useState<string | undefined>(defaultActiveOptionId);

    const handleButtonClick = React.useCallback(
        (optionId: string) => () => {
            setActiveOptionId(optionId);
            onActiveOptionChange?.(optionId);
        },
        [onActiveOptionChange],
    );

    return (
        <div className={classNames(Classes.SEGMENTED_CONTROL, className)} ref={ref} {...removeNonHTMLProps(htmlProps)}>
            {options.map(({ id, label }) => {
                const active = activeOptionId === id;

                return (
                    <Button
                        onClick={handleButtonClick(id)}
                        intent={active ? intent : Intent.NONE}
                        minimal={!active}
                        small={true}
                        key={id}
                    >
                        {label}
                    </Button>
                );
            })}
        </div>
    );
});
SegmentedControl.defaultProps = {
    defaultActiveOptionId: undefined,
    intent: Intent.NONE,
};
SegmentedControl.displayName = `${DISPLAYNAME_PREFIX}.SegmentedControl`;
