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
import { useCallback, useMemo, useRef, useState } from "react";

import {
    Button,
    Classes,
    FormGroup,
    H5,
    HTMLSelect,
    Intent,
    NumericInput,
    OverlayToaster,
    Position,
    ProgressBar,
    Switch,
    type Toaster,
    type ToasterPosition,
    type ToastProps,
} from "@blueprintjs/core";
import {
    Example,
    type ExampleProps,
    handleBooleanChange,
    handleValueChange,
} from "@blueprintjs/docs-theme";

import type { BlueprintExampleData } from "../../tags/types";

type ToastDemo = ToastProps & { button: string };

const POSITIONS = [
    Position.TOP_LEFT,
    Position.TOP,
    Position.TOP_RIGHT,
    Position.BOTTOM_LEFT,
    Position.BOTTOM,
    Position.BOTTOM_RIGHT,
];

export const ToastExample: React.FC<ExampleProps<BlueprintExampleData>> = props => {
    const [autoFocus, setAutoFocus] = useState(false);
    const [canEscapeKeyClear, setCanEscapeKeyClear] = useState(true);
    const [position, setPosition] = useState<ToasterPosition>(Position.TOP);
    const [usePortal, setUsePortal] = useState(true);
    const [maxToasts, setMaxToasts] = useState<number | undefined>(undefined);

    const toasterRef = useRef<Toaster | null>(null);
    const progressToastIntervalRef = useRef<number | undefined>(undefined);

    const themeName = props.data.themeName;

    const addToast = useCallback(
        (toast: ToastProps) => {
            toast.className = themeName;
            toast.timeout = 5000;
            toasterRef.current?.show(toast);
        },
        [themeName],
    );

    const toastBuilders = useMemo((): ToastDemo[] => {
        const deleteRoot: ToastDemo = {
            action: {
                onClick: () => addToast(deleteRoot),
                text: "Retry",
            },
            button: "Delete root",
            icon: "warning-sign",
            intent: Intent.DANGER,
            message:
                "You do not have permissions to perform this action. \
    Please contact your system administrator to request the appropriate access rights.",
        };

        return [
            {
                action: {
                    href: "https://www.google.com/search?q=toast&source=lnms&tbm=isch",
                    target: "_blank",
                    text: <strong>Yum.</strong>,
                },
                button: "Procure toast",
                intent: Intent.PRIMARY,
                message: (
                    <>
                        One toast created. <em>Toasty.</em>
                    </>
                ),
            },
            {
                action: {
                    onClick: () =>
                        addToast({
                            icon: "ban-circle",
                            intent: Intent.DANGER,
                            message: "You cannot undo the past.",
                        }),
                    text: "Undo",
                },
                button: "Move files",
                icon: "tick",
                intent: Intent.SUCCESS,
                message: "Moved 6 files.",
            },
            deleteRoot,
            {
                action: {
                    onClick: () => addToast({ message: "Isn't parting just the sweetest sorrow?" }),
                    text: "Adieu",
                },
                button: "Log out",
                icon: "hand",
                intent: Intent.WARNING,
                message: "Goodbye, old friend.",
            },
            {
                action: {
                    onClick: () =>
                        addToast({
                            icon: "ban-circle",
                            intent: Intent.DANGER,
                            message: "You can't cancel what's been done!",
                        }),
                    text: "Cancel",
                },
                button: "Start loading",
                icon: "hand",
                intent: Intent.PRIMARY,
                isCloseButtonShown: false,
                message: "Loading...",
            },
        ];
    }, [addToast]);

    const renderProgress = useCallback(
        (amount: number): ToastProps => ({
            className: themeName,
            icon: "cloud-upload",
            message: (
                <ProgressBar
                    className={classNames("docs-toast-progress", {
                        [Classes.PROGRESS_NO_STRIPES]: amount >= 100,
                    })}
                    intent={amount < 100 ? Intent.PRIMARY : Intent.SUCCESS}
                    value={amount / 100}
                />
            ),
            onDismiss: (didTimeoutExpire: boolean) => {
                if (!didTimeoutExpire) {
                    // user dismissed toast with click
                    window.clearInterval(progressToastIntervalRef.current);
                }
            },
            timeout: amount < 100 ? 0 : 2000,
        }),
        [themeName],
    );

    const handleProgressToast = useCallback(() => {
        let progress = 0;
        const key = toasterRef.current!.show(renderProgress(0));
        progressToastIntervalRef.current = window.setInterval(() => {
            if (toasterRef.current == null || progress > 100) {
                window.clearInterval(progressToastIntervalRef.current);
            } else {
                progress += 10 + Math.random() * 20;
                toasterRef.current.show(renderProgress(progress), key);
            }
        }, 1000);
    }, [renderProgress]);

    const handleMaxToastsChange = useCallback((value: number) => {
        if (value) {
            setMaxToasts(Math.max(1, value));
        } else {
            setMaxToasts(undefined);
        }
    }, []);

    const options = (
        <>
            <H5>Props</H5>
            <FormGroup label="Position">
                <HTMLSelect
                    value={position}
                    onChange={handleValueChange(setPosition)}
                    options={POSITIONS}
                />
            </FormGroup>
            <FormGroup label="Maximum active toasts">
                <NumericInput
                    allowNumericCharactersOnly={true}
                    placeholder="No maximum!"
                    min={1}
                    value={maxToasts}
                    onValueChange={handleMaxToastsChange}
                />
            </FormGroup>
            <Switch label="Auto focus" checked={autoFocus} onChange={handleBooleanChange(setAutoFocus)} />
            <Switch
                label="Can escape key clear"
                checked={canEscapeKeyClear}
                onChange={handleBooleanChange(setCanEscapeKeyClear)}
            />
            <Switch label="Use portal" checked={usePortal} onChange={handleBooleanChange(setUsePortal)} />
        </>
    );

    return (
        <Example options={options} {...props}>
            {toastBuilders.map((toast, index) => (
                <Button
                    intent={toast.intent}
                    key={index}
                    text={toast.button}
                    onClick={() => addToast(toast)}
                />
            ))}
            <Button onClick={handleProgressToast} text="Upload file" />
            <OverlayToaster
                autoFocus={autoFocus}
                canEscapeKeyClear={canEscapeKeyClear}
                position={position}
                usePortal={usePortal}
                maxToasts={maxToasts}
                ref={ref => {
                    toasterRef.current = ref;
                }}
            />
        </Example>
    );
};
