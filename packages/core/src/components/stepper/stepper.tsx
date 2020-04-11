/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
import { polyfill } from 'react-lifecycles-compat';
import { Classes } from '../../common';
import { IStepProps, AttachedStep } from './step';
import { IStepConnectorProps, StepConnector } from './stepConnector';

export interface IStepperProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactElement<IStepProps>[] | React.ReactElement<IStepProps>;

    /**
     * Set the active step (zero based index). Set to -1 to disable all the steps.
     */
    activeStep: number;

    /**
     * Sets the orientation of the stepper to vertical.
     * @default false
     */
    vertical?: boolean;

    /**
     * The stepper will take up the full width of its container, or height if `vertical` is true.
     * If set to "accordion", the connector after the active step (if there is one) will fill the most.
     * @default false
     */
    fill?: boolean | "accordion";

    /**
     * Gives the steps a large appearance.
     * @default false
     */
    large?: boolean;

    /**
     * If set to 'true' and orientation is horizontal, then the step label will be positioned under the icon.
     * @default false
     */
    alternativeLabel?: boolean;

    /**
     * If set to 'true', steps ahead of the current `activeStep` will be disabled.
     * @default true
     */
    linear?: boolean;

    /**
     * The component that is placed between steps in a Stepper.  Defaults to the basic step connector that renders
     * a line between each step.  Can be set to null to prevent any connectors.
     * @default <StepConnector />
     */
    connector?: React.ReactElement<IStepConnectorProps> | null;
}

@polyfill
export class Stepper extends React.PureComponent<IStepperProps> {
    public render() {
        const {
            children,
            connector,
            activeStep,
            fill = false,
            vertical = false,
            alternativeLabel = false,
            linear,
            className: controlledClassName,
            ...restProps
        } = this.props;

        let className = classNames(controlledClassName,
            Classes.STEPPER,
            vertical ? Classes.STEPPER_VERTICAL : Classes.STEPPER_HORIZONTAL,
            alternativeLabel ? Classes.STEPPER_ALTERNATIVE_LABEL : '',
            fill ? Classes.FILL : '',
            fill === "accordion" ? Classes.STEPPER_ACCORDION : '');

        return (
            <div {...restProps} className={className}>
                {this.renderContent()}
            </div>
        )
    }

    private renderContent = (): React.ReactNode => {
        const {
            children,
            activeStep,
            alternativeLabel = false,
            linear = true,
            large = false,
            connector: connectorProp = <StepConnector />
        } = this.props;

        if (!children) {
            return null;
        }

        const steps = (Array.isArray(children) ? children : [children]).filter(c => c);
        if (steps.length === 0) {
            return null;
        }

        const connector = connectorProp ? React.cloneElement<IStepConnectorProps>(connectorProp) : null;

        return steps.map((step: React.ReactElement<IStepProps>, index: number) => {
            const state: Partial<IStepProps & AttachedStep> = {
                active: false,
                completed: false,
                disabled: false,
                large
            };

            if (activeStep === index) {
                state.active = true;
            } else if (linear && activeStep > index) {
                state.completed = true;
            } else if (linear && activeStep < index) {
                state.disabled = true;
            }

            const stepConnector = connector
                && index !== 0
                && React.cloneElement(connector, {
                    key: index + '_connector',
                    ...state,
                });

            return [
                (!alternativeLabel && stepConnector) || null,
                React.cloneElement<IStepProps & AttachedStep>(step, {
                    ...state,
                    key: index + '_step',
                    connector: (alternativeLabel && stepConnector) || null,
                    ...step.props
                })
            ]
        });
    }
}
