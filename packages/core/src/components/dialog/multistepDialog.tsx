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
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { Button, IButtonProps } from "../button/buttons";
import { Dialog, IDialogProps } from "./dialog";
import { DialogStep, DialogStepId, IDialogStepProps } from "./dialogStep";

type DialogStepElement = React.ReactElement<IDialogStepProps & { children: React.ReactNode }>;

export interface IMultistepDialogProps extends IDialogProps {
    /**
     * Props for the button to display on the final step.
     */
    finalButtonProps?: Partial<IButtonProps>;

    /**
     * Props for the next button.
     */
    nextButtonProps?: Partial<Pick<IButtonProps, "disabled" | "text">>;

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
     */
    resetOnClose?: boolean;
}

interface IMultistepDialogState {
    lastViewedIndex: number;
    selectedIndex: number;
}

const PADDING_BOTTOM = 0;

const MIN_WIDTH = 800;

const INITIAL_STATE = {
    lastViewedIndex: 0,
    selectedIndex: 0,
};

@polyfill
export class MultistepDialog extends AbstractPureComponent2<IMultistepDialogProps, IMultistepDialogState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.MultistepDialog`;

    public static defaultProps: Partial<IMultistepDialogProps> = {
        canOutsideClickClose: true,
        isOpen: false,
    };

    public state: IMultistepDialogState = INITIAL_STATE;

    public render() {
        return (
            <Dialog {...this.props} style={this.getDialogStyle()}>
                <div className={Classes.MULTISTEP_DIALOG_PANELS}>
                    {this.renderLeftPanel()}
                    {this.maybeRenderRightPanel()}
                </div>
            </Dialog>
        );
    }

    public componentDidUpdate(prevProps: IMultistepDialogProps) {
        if (
            (prevProps.resetOnClose === undefined || prevProps.resetOnClose) &&
            !prevProps.isOpen &&
            this.props.isOpen
        ) {
            this.setState(INITIAL_STATE);
        }
    }

    private getDialogStyle() {
        return { minWidth: MIN_WIDTH, paddingBottom: PADDING_BOTTOM, ...this.props.style };
    }

    private renderLeftPanel() {
        return (
            <div className={Classes.MULTISTEP_DIALOG_LEFT_PANEL}>
                {this.getDialogStepChildren().filter(isDialogStepElement).map(this.renderDialogStep)}
            </div>
        );
    }

    private renderDialogStep = (step: DialogStepElement, index: number) => {
        const stepNumber = index + 1;
        const hasBeenViewed = this.state.lastViewedIndex >= index;
        const currentlySelected = this.state.selectedIndex === index;
        return (
            <div className={classNames(Classes.DIALOG_STEP_CONTAINER, { [Classes.ACTIVE]: hasBeenViewed })} key={index}>
                <div className={Classes.DIALOG_STEP} onClick={this.handleClickDialogStep(index)}>
                    <div className={Classes.DIALOG_STEP_ICON}>{stepNumber}</div>
                    <div className={classNames(Classes.DIALOG_STEP_TITLE, { [Classes.ACTIVE]: currentlySelected })}>
                        {step.props.title}
                    </div>
                </div>
            </div>
        );
    };

    private handleClickDialogStep = (index: number) => {
        if (index > this.state.lastViewedIndex) {
            return;
        }
        return this.getDialogStepChangeHandler(index);
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
        return (
            <div className={Classes.MULTISTEP_DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>{this.renderButtons()}</div>
            </div>
        );
    }

    private renderButtons() {
        const buttons = [];
        if (this.state.selectedIndex > 0) {
            buttons.push(<Button key="back" onClick={this.getBackClickHandler()} text="Back" />);
        }

        if (this.state.selectedIndex === this.getDialogStepChildren().length - 1) {
            buttons.push(this.renderFinalButton());
        } else {
            buttons.push(
                <Button
                    intent="primary"
                    key="next"
                    onClick={this.getNextClickHandler()}
                    text="Next"
                    {...this.props.nextButtonProps}
                />,
            );
        }

        return buttons;
    }

    private getBackClickHandler() {
        return this.getDialogStepChangeHandler(this.state.selectedIndex - 1);
    }

    private getNextClickHandler() {
        return this.getDialogStepChangeHandler(this.state.selectedIndex + 1);
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

    private renderFinalButton() {
        return <Button intent="primary" key="final" text="Submit" {...this.props.finalButtonProps} />;
    }

    /** Filters children to only `<DialogStep>`s */
    private getDialogStepChildren(props: IMultistepDialogProps & { children?: React.ReactNode } = this.props) {
        return React.Children.toArray(props.children).filter(isDialogStepElement);
    }
}

function isDialogStepElement(child: any): child is DialogStepElement {
    return Utils.isElementOfType(child, DialogStep);
}
