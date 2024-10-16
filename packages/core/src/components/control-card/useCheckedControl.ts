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

import * as React from "react";

import type { CheckedControlProps } from "../forms/controlProps";

/**
 * Keep track of a control's checked state in both controlled and uncontrolled modes
 */
export function useCheckedControl(props: CheckedControlProps) {
    const [checkedStateForUncontrolledMode, setChecked] = React.useState(() => props.defaultChecked ?? false);

    // If the checked prop is passed, this input is in "controlled mode" and
    // should always reflect the value of the controlled prop. Any internal
    // state tracked for "uncontrolled mode" should be ignored.
    const checked = props.checked ?? checkedStateForUncontrolledMode;

    const onChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
        e => {
            setChecked(c => !c);
            props.onChange?.(e);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.onChange],
    );
    return { checked, onChange };
}
