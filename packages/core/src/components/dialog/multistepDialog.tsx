/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent, Classes, type Position, Utils } from "../../common";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { clickElementOnKeyPress } from "../../common/utils";
import { Dialog, type DialogProps } from "./dialog";
import { DialogFooter } from "./dialogFooter";
import { DialogStep, type DialogStepId, type DialogStepProps } from "./dialogStep";
import { DialogStepButton, type DialogStepButtonProps } from "./dialogStepButton";

type DialogStepElement = React.ReactElement<DialogStepProps & { children: React.ReactNode }>;

export type MultistepDialogNavPosition = typeof Position.TOP | typeof Position.LEFT | typeof Position.RIGHT;

export interface MultistepDialogProps extends DialogProps {
    /**
     * Props for the back button.
     */
    backButtonProps?: DialogStepButtonProps;

    /** Dialog steps. */
    children?: React.ReactNode;

    /**
     * Props for the close button that appears in the footer.
     */
    closeButtonProps?: DialogStepButtonProps;

    /**
     * Props for the button to display on the final step.
     */
    finalButtonProps?: DialogStepButtonProps;

    /**
     * Position of the step navigation within the dialog.
     *
     * @default "left"
     */
    navigationPosition?: MultistepDialogNavPosition;

    /**
     * Props for the next button.
     */
    nextButtonProps?: DialogStepButtonProps;

    /**
     * A callback that is invoked when the user selects a different step by clicking on back, next, or a step itself.
     */
    onChange?(
        newDialogStepId: DialogStepId,
        prevDialogStepId: DialogStepId | undefined,
        event: React.MouseEvent<HTMLElement>,
    ): void;

    /**
     * Whether to reset the dialog state to its initial state on close.
     * By default, closing the dialog will reset its state.
     *
     * @default true
     */
    resetOnClose?: boolean;

    /**
     * Whether the footer close button is shown. When this value is true, the button will appear
     * regardless of the value of `isCloseButtonShown`.
     *
     * @default false
     */
    showCloseButtonInFooter?: boolean;

    /**
     * A 0 indexed initial step to start off on, to start in the middle of the dialog, for example.
     * If the provided index exceeds the number of steps, it defaults to the last step.
     * If a negative index is provided, it defaults to the first step.
     */
    initialStepIndex?: number;
}

interface MultistepDialogState {
    lastViewedIndex: number;
    selectedIndex: number;
}

const PADDING_BOTTOM = 0;

const MIN_WIDTH = 800;

/**
 * Multi-step dialog component.
 *
 * @see https://blueprintjs.com/docs/#core/components/dialog.multistep-dialog
 */
export class MultistepDialog extends AbstractPureComponent<MultistepDialogProps, MultistepDialogState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.MultistepDialog`;

    public static defaultProps: Partial<MultistepDialogProps> = {
        canOutsideClickClose: true,
        isOpen: false,
        navigationPosition: "left",
        resetOnClose: true,
        showCloseButtonInFooter: false,
    };

    public state: MultistepDialogState = this.getInitialIndexFromProps(this.props);

    public render() {
        const { className, navigationPosition, showCloseButtonInFooter, isCloseButtonShown, ...otherProps } =
            this.props;

        return (
            <Dialog
                isCloseButtonShown={isCloseButtonShown}
                {...otherProps}
                className={classNames(
                    {
                        [Classes.MULTISTEP_DIALOG_NAV_RIGHT]: navigationPosition === "right",
                        [Classes.MULTISTEP_DIALOG_NAV_TOP]: navigationPosition === "top",
                    },
                    className,
                )}
                style={this.getDialogStyle()}
            >
                <div className={Classes.MULTISTEP_DIALOG_PANELS}>
                    {this.renderLeftPanel()}
                    {this.maybeRenderRightPanel()}
                </div>
            </Dialog>
        );
    }

    public componentDidUpdate(prevProps: MultistepDialogProps) {
        if (
            (prevProps.resetOnClose || prevProps.initialStepIndex !== this.props.initialStepIndex) &&
            !prevProps.isOpen &&
            this.props.isOpen
        ) {
            this.setState(this.getInitialIndexFromProps(this.props));
        }
    }

    private getDialogStyle() {
        return { minWidth: MIN_WIDTH, paddingBottom: PADDING_BOTTOM, ...this.props.style };
    }

    private renderLeftPanel() {
        return (
            <div className={Classes.MULTISTEP_DIALOG_LEFT_PANEL} role="tablist" aria-label="steps">
                {this.getDialogStepChildren().filter(isDialogStepElement).map(this.renderDialogStep)}
            </div>
        );
    }

    private renderDialogStep = (step: DialogStepElement, index: number) => {
        const stepNumber = index + 1;
        const hasBeenViewed = this.state.lastViewedIndex >= index;
        const currentlySelected = this.state.selectedIndex === index;
        const handleClickDialogStep =
            index > this.state.lastViewedIndex ? undefined : this.getDialogStepChangeHandler(index);
        return (
            <div
                className={classNames(Classes.DIALOG_STEP_CONTAINER, {
                    [Classes.ACTIVE]: currentlySelected,
                    [Classes.DIALOG_STEP_VIEWED]: hasBeenViewed,
                })}
                key={index}
                aria-selected={currentlySelected}
                role="tab"
            >
                <div
                    className={Classes.DIALOG_STEP}
                    onClick={handleClickDialogStep}
                    tabIndex={handleClickDialogStep ? 0 : -1}
                    // enable enter key to take effect on the div as if it were a button
                    onKeyDown={clickElementOnKeyPress(["Enter", " "])}
                >
                    <div className={Classes.DIALOG_STEP_ICON}>{stepNumber}</div>
                    <div className={Classes.DIALOG_STEP_TITLE}>{step.props.title}</div>
                </div>
            </div>
        );
    };

    private maybeRenderRightPanel() {
        const steps = this.getDialogStepChildren();
        if (steps.length <= this.state.selectedIndex) {
            return null;
        }

        const { className, panel, panelClassName } = steps[this.state.selectedIndex].props;
        return (
            <div className={classNames(Classes.MULTISTEP_DIALOG_RIGHT_PANEL, className, panelClassName)}>
                {panel}
                {this.renderFooter()}
            </div>
        );
    }

    private renderFooter() {
        const { closeButtonProps, showCloseButtonInFooter, onClose } = this.props;
        const maybeCloseButton = !showCloseButtonInFooter ? undefined : (
            <DialogStepButton text="Close" onClick={onClose} {...closeButtonProps} />
        );
        return <DialogFooter actions={this.renderButtons()}>{maybeCloseButton}</DialogFooter>;
    }

    private renderButtons() {
        const { selectedIndex } = this.state;
        const steps = this.getDialogStepChildren();
        const buttons = [];

        if (this.state.selectedIndex > 0) {
            const backButtonProps = steps[selectedIndex].props.backButtonProps ?? this.props.backButtonProps;
            buttons.push(
                <DialogStepButton
                    key="back"
                    onClick={this.getDialogStepChangeHandler(selectedIndex - 1)}
                    text="Back"
                    {...backButtonProps}
                />,
            );
        }

        if (selectedIndex === this.getDialogStepChildren().length - 1) {
            buttons.push(
                <DialogStepButton intent="primary" key="final" text="Submit" {...this.props.finalButtonProps} />,
            );
        } else {
            const nextButtonProps = steps[selectedIndex].props.nextButtonProps ?? this.props.nextButtonProps;
            buttons.push(
                <DialogStepButton
                    intent="primary"
                    key="next"
                    onClick={this.getDialogStepChangeHandler(selectedIndex + 1)}
                    text="Next"
                    {...nextButtonProps}
                />,
            );
        }

        return buttons;
    }

    private getDialogStepChangeHandler(index: number) {
        return (event: React.MouseEvent<HTMLElement>) => {
            if (this.props.onChange !== undefined) {
                const steps = this.getDialogStepChildren();
                const prevStepId = steps[this.state.selectedIndex].props.id;
                const newStepId = steps[index].props.id;
                this.props.onChange(newStepId, prevStepId, event);
            }
            this.setState({
                lastViewedIndex: Math.max(this.state.lastViewedIndex, index),
                selectedIndex: index,
            });
        };
    }

    /** Filters children to only `<DialogStep>`s */
    private getDialogStepChildren(props: MultistepDialogProps & { children?: React.ReactNode } = this.props) {
        return React.Children.toArray(props.children).filter(isDialogStepElement);
    }

    private getInitialIndexFromProps(props: MultistepDialogProps) {
        if (props.initialStepIndex !== undefined) {
            const boundedInitialIndex = Math.max(
                0,
                Math.min(props.initialStepIndex, this.getDialogStepChildren(props).length - 1),
            );
            return {
                lastViewedIndex: boundedInitialIndex,
                selectedIndex: boundedInitialIndex,
            };
        } else {
            return {
                lastViewedIndex: 0,
                selectedIndex: 0,
            };
        }
    }
}

function isDialogStepElement(child: any): child is DialogStepElement {
    return Utils.isElementOfType(child, DialogStep);
}
