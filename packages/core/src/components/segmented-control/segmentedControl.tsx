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
import { ButtonGroup } from "../button/buttonGroup";
import { Button } from "../button/buttons";

import { Classes, Intent } from "../../common";
import { DISPLAYNAME_PREFIX, HTMLDivProps, Props } from "../../common/props";

export interface SegmentedControlProps extends Props, HTMLDivProps, React.RefAttributes<HTMLDivElement> {
    options: {
        id: string;
        label: string;
    }[];
    defaultActiveOptionIds?: string[];
    onActiveOptionsChange?: (activeOptionIds: string[]) => void;
    intent?: typeof Intent.NONE | typeof Intent.PRIMARY;
}

/**
 * Segmented control component.
 *
 * @see https://blueprintjs.com/docs/#core/components/segmented-control
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = React.forwardRef((props, ref) => {
    const { className, options, defaultActiveOptionIds, intent, onActiveOptionsChange, ...htmlProps } = props;
    const classes = classNames(Classes.SEGMENTED_CONTROL, className);

    const [activeOptionIds, setActiveOptionIds] = React.useState<string[]>(defaultActiveOptionIds ?? []);

    const handleButtonClick = React.useCallback(
        (optionId: string) => () => {
            const optionIndex = activeOptionIds.indexOf(optionId);

            if (optionIndex === -1) {
                setActiveOptionIds([...activeOptionIds, optionId]);
            } else {
                setActiveOptionIds(activeOptionIds.splice(optionIndex, 1));
            }

            if (onActiveOptionsChange != null) {
                onActiveOptionsChange(activeOptionIds);
            }
        },
        [activeOptionIds, onActiveOptionsChange],
    );

    return (
        <div className={classes} ref={ref} {...htmlProps}>
            <ButtonGroup>
                {options.map(({ id, label }) => {
                    const active = activeOptionIds?.includes(id);

                    return (
                        <Button
                            onClick={handleButtonClick(id)}
                            intent={active ? intent : Intent.NONE}
                            minimal={!active}
                            key={id}
                        >
                            {label}
                        </Button>
                    );
                })}
            </ButtonGroup>
        </div>
    );
});
SegmentedControl.defaultProps = {
    defaultActiveOptionIds: undefined,
    intent: Intent.NONE,
};
SegmentedControl.displayName = `${DISPLAYNAME_PREFIX}.SegmentedControl`;
