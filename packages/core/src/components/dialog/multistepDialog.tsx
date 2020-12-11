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
import { polyfill } from "react-lifecycles-compat";
import { AbstractPureComponent2, Classes, Utils } from "../../common";
import * as Errors from "../../common/errors";
import { DISPLAYNAME_PREFIX, IActionProps, IElementRefProps } from "../../common/props";
import { Button, IButtonProps } from "../button/buttons";
import { Dialog, IDialogProps } from "./dialog";
import { IStepProps, Step, StepId } from "./step";

export type ISubmitButtonProps = Pick<IButtonProps, "loading" | "rightIcon" | "active"> &
    IActionProps &
    IElementRefProps<any>;

type MultistepDialogId = string | number;

type StepElement = React.ReactElement<IStepProps & { children: React.ReactNode }>;

export interface IMultistepDialogProps extends IDialogProps {
    /**
     * Unique identifier for this `MultistepDialog` container. This will be combined with the `id` of each
     * `Step` child to generate ARIA accessibility attributes. IDs are required and should be
     * unique on the page to support server-side rendering.
     */
    id: MultistepDialogId;

    /**
     * Function to call when a new step is selected.
     */
    onChange?(newStepId: StepId, prevStepId: StepId | undefined, event: React.MouseEvent<HTMLElement>): void;

    /**
     * Props for the submit button on the final step.
     * This prop is required because the dialog should perform some action at the end of the steps.
     */
    submitButtonProps: ISubmitButtonProps;
}

interface IMultistepDialogState {
    enableNextButton: boolean;
    lastViewedIndex: number;
    selectedIndex: number;
}

const PADDING_BOTTOM = 0;

const MIN_WIDTH = 800;

@polyfill
export class MultistepDialog extends AbstractPureComponent2<IMultistepDialogProps, IMultistepDialogState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.MultistepDialog`;

    public static defaultProps: Partial<IMultistepDialogProps> = {
        canOutsideClickClose: true,
        isOpen: false,
    };

    public constructor(props: IMultistepDialogProps) {
        super(props);
        const steps = this.getStepChildren();
        if (steps.length > 0) {
            this.state = {
                enableNextButton: isNextButtonEnabled(steps[0]),
                lastViewedIndex: 0,
                selectedIndex: 0,
            };
        }
    }

    public componentDidUpdate(prevProps: IMultistepDialogProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            const steps = this.getStepChildren();
            if (steps.length > 0) {
                this.setState({
                    enableNextButton: isNextButtonEnabled(steps[0]),
                    lastViewedIndex: 0,
                    selectedIndex: 0,
                });
            }
        }
    }

    public render() {
        return (
            <Dialog style={this.getStyle()} {...this.props}>
                <div className={Classes.MULTISTEP_DIALOG_PANELS}>
                    {this.renderLeftPanel()}
                    {this.maybeRenderRightPanel()}
                </div>
            </Dialog>
        );
    }

    protected validateProps(props: IMultistepDialogProps) {
        if (props.title == null) {
            if (props.icon != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_ICON);
            }
        }
    }

    private getStyle() {
        return { paddingBottom: PADDING_BOTTOM, minWidth: MIN_WIDTH, ...this.props.style };
    }

    private renderLeftPanel() {
        return (
            <div className={Classes.MULTISTEP_DIALOG_LEFT_PANEL}>
                {React.Children.toArray(this.props.children).filter(isStepElement).map(this.renderStep)}
            </div>
        );
    }

    private renderStep = (step: StepElement, index: number) => {
        const stepNumber = index + 1;
        return (
            <div className={classNames(Classes.STEP_CONTAINER, this.state.lastViewedIndex >= index && Classes.ACTIVE)}>
                <div
                    className={classNames(Classes.STEP, this.state.lastViewedIndex >= index && Classes.ACTIVE)}
                    onClick={this.getOnSelectStep(index)}
                >
                    <div
                        className={classNames(Classes.STEP_ICON, this.state.lastViewedIndex >= index && Classes.ACTIVE)}
                    >
                        {stepNumber}
                    </div>
                    <div
                        className={classNames(Classes.STEP_TITLE, this.state.selectedIndex === index && Classes.ACTIVE)}
                    >
                        {step.props.title}
                    </div>
                </div>
            </div>
        );
    };

    private getOnSelectStep = (index: number) => {
        if (this.state.lastViewedIndex < index) {
            return undefined;
        }
        return () => {
            this.setState({
                lastViewedIndex: Math.max(this.state.lastViewedIndex, index),
                selectedIndex: index,
            });
        };
    };

    private maybeRenderRightPanel() {
        const steps = this.getStepChildren();
        if (steps.length <= this.state.selectedIndex) {
            return null;
        }

        const { className, renderPanel, panelClassName } = steps[this.state.selectedIndex].props;
        if (renderPanel === undefined) {
            return null;
        }

        return (
            <div
                className={classNames(Classes.MULTISTEP_DIALOG_RIGHT_PANEL, className, panelClassName)}
                role="steppanel"
            >
                {renderPanel({ updateDialog: this.updateDialog })}
                {this.renderFooter()}
            </div>
        );
    }

    private updateDialog = (state: { enableNextButton: boolean }) => {
        this.setState({
            enableNextButton: state.enableNextButton,
        });
    };

    private renderFooter() {
        return (
            <div className={Classes.MULTISTEP_DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>{this.renderButtons()}</div>
            </div>
        );
    }

    private renderButtons() {
        const buttons = [];
        if (this.state.selectedIndex > 0) {
            buttons.push(<Button onClick={this.handleClickBack} text="Back" />);
        }

        if (this.state.selectedIndex === this.getStepChildren().length - 1) {
            buttons.push(this.getSubmitButton());
        } else {
            buttons.push(<Button intent="primary" onClick={this.handleClickNext} text="Next" />);
        }
        return buttons;
    }

    private handleClickBack = () => {
        this.setState({
            selectedIndex: this.state.selectedIndex - 1,
        });
    };

    private handleClickNext = () => {
        this.setState({
            lastViewedIndex: this.state.selectedIndex + 1,
            selectedIndex: this.state.selectedIndex + 1,
        });
    };

    private getSubmitButton() {
        if (this.props.submitButtonProps === undefined) {
            return <Button {...this.props.submitButtonProps} />;
        } else {
            return <Button intent="danger" onClick={this.props.onClose} text="Submit" />;
        }
    }

    /** Filters children to only `<Step>`s */
    private getStepChildren(props: IMultistepDialogProps & { children?: React.ReactNode } = this.props) {
        return React.Children.toArray(props.children).filter(isStepElement);
    }
}

function isNextButtonEnabled(step: StepElement) {
    return step.props.nextButtonEnabledByDefault !== undefined ? step.props.nextButtonEnabledByDefault : false;
}

function isStepElement(child: any): child is StepElement {
    return Utils.isElementOfType(child, Step);
}
