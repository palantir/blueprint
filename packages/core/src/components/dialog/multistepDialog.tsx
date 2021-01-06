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
import { IStepProps, Step, StepId } from "./step";

type StepElement = React.ReactElement<IStepProps & { children: React.ReactNode }>;

export interface IMultistepDialogProps extends IDialogProps {
    /**
     * Whether to disable the next button in the panel footer.
     */
    disableNext?: boolean;

    /**
     * Props for the button to display on the final step.
     */
    finalButtonProps?: Partial<IButtonProps>;

    /**
     * A callback that is invoked when the user selects a different step by clicking on back, next, or a step itself.
     */
    onChange?(newStepId: StepId, prevStepId: StepId | undefined, event: React.MouseEvent<HTMLElement>): void;
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

    public constructor(props: IMultistepDialogProps) {
        super(props);
        this.state = INITIAL_STATE;
    }

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
        if (!prevProps.isOpen && this.props.isOpen) {
            this.setState(INITIAL_STATE);
        }
    }

    private getDialogStyle() {
        return { paddingBottom: PADDING_BOTTOM, minWidth: MIN_WIDTH, ...this.props.style };
    }

    private renderLeftPanel() {
        return (
            <div className={Classes.MULTISTEP_DIALOG_LEFT_PANEL}>
                {this.getStepChildren().filter(isStepElement).map(this.renderStep)}
            </div>
        );
    }

    private renderStep = (step: StepElement, index: number) => {
        const stepNumber = index + 1;
        const hasBeenViewed = this.state.lastViewedIndex >= index;
        const currentlySelected = this.state.selectedIndex === index;
        return (
            <div className={classNames(Classes.STEP_CONTAINER, { [Classes.ACTIVE]: hasBeenViewed })} key={index}>
                <div
                    className={classNames(Classes.STEP, { [Classes.ACTIVE]: hasBeenViewed })}
                    onClick={this.handleClickStep(index)}
                >
                    <div className={classNames(Classes.STEP_ICON, { [Classes.ACTIVE]: hasBeenViewed })}>
                        {stepNumber}
                    </div>
                    <div className={classNames(Classes.STEP_TITLE, { [Classes.ACTIVE]: currentlySelected })}>
                        {step.props.title}
                    </div>
                </div>
            </div>
        );
    };

    private handleClickStep = (index: number) => {
        if (index > this.state.lastViewedIndex) {
            return undefined;
        }
        return this.handleChangeStep(index);
    };

    private maybeRenderRightPanel() {
        const steps = this.getStepChildren();
        if (steps.length <= this.state.selectedIndex) {
            return null;
        }

        const stepProp = steps[this.state.selectedIndex].props;
        if (stepProp.panel === undefined) {
            return null;
        }

        const { className, panelClassName } = stepProp;
        return (
            <div
                className={classNames(Classes.MULTISTEP_DIALOG_RIGHT_PANEL, className, panelClassName)}
                role="steppanel"
            >
                {stepProp.panel}
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
            buttons.push(<Button key="back" onClick={this.handleClickBack()} text="Back" />);
        }

        if (this.state.selectedIndex === this.getStepChildren().length - 1) {
            buttons.push(this.getFinalButton());
        } else {
            buttons.push(
                <Button
                    disabled={this.props.disableNext}
                    intent="primary"
                    key="next"
                    onClick={this.handleClickNext()}
                    text="Next"
                />,
            );
        }

        return buttons;
    }

    private handleClickBack() {
        return this.handleChangeStep(this.state.selectedIndex - 1);
    }

    private handleClickNext() {
        return this.handleChangeStep(this.state.selectedIndex + 1);
    }

    private handleChangeStep(index: number) {
        return (event: React.MouseEvent<HTMLElement>) => {
            if (this.props.onChange !== undefined) {
                const steps = this.getStepChildren();
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

    private getFinalButton() {
        return <Button intent="primary" key="final" text="Submit" {...this.props.finalButtonProps} />;
    }

    /** Filters children to only `<Step>`s */
    private getStepChildren(props: IMultistepDialogProps & { children?: React.ReactNode } = this.props) {
        return React.Children.toArray(props.children).filter(isStepElement);
    }
}

function isStepElement(child: any): child is StepElement {
    return Utils.isElementOfType(child, Step);
}
