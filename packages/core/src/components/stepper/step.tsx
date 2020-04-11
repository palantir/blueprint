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
import { MaybeElement, Classes } from '../../common';
import { Collapse, ICollapseProps } from '../collapse/collapse';
import { IconName, Icon } from '../icon/icon';
import { IStepConnectorProps } from './stepConnector';

export interface IStepProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Label of the step. */
    label: React.ReactNode;

    /** Additional content to display below the label. */
    labelInfo?: React.ReactNode;

    /** Gives the step a large appearance.  If using `Stepper`, this is defaulted to true if based on `large` prop is true. */
    large?: boolean;

    /**
     * The default icon or content to display.  Overridden by `error` or `completed` props.
     * Defaults to undefined, which will use a dot instead of icon.
     */
    icon?: IconName | MaybeElement;

    /** If true, the `icon` prop will be overriden by "error" and the `intent` prop will be overridden by "danger". */
    error?: boolean;

    /** If true, the `icon` prop will be overriden by "tick" and the `intent` prop will be overridden by "primary". */
    completed?: boolean;

    /** Sets the step as active.  If using `Stepper`, this is defaulted to true if based on `disabled` prop is true. */
    disabled?: boolean;

    /** Props to configure the step content container. */
    stepContentProps?: ICollapseProps;
}

export interface AttachedStep {
    /** Sets the step as active.  If using `Stepper`, this is defaulted to true if `activeStep` prop matches step index. */
    active?: boolean;

    connector?: React.ReactElement<IStepConnectorProps> | null;
}

@polyfill
export class Step extends React.PureComponent<IStepProps & AttachedStep> {
    public render() {
        const {
            children,
            className,
            icon: defaultIcon,
            active = false,
            completed = false,
            error = false,
            disabled = false,
            large = false,
            label,
            labelInfo,
            connector,
            stepContentProps = {},
            ...divProps
        } = this.props;

        const { className: contentClassName, ...restContentProps } = stepContentProps;

        const icon: IStepProps['icon'] = error ? "error" : completed ? "tick" : defaultIcon;
        const iconSize = large ? Icon.SIZE_LARGE : Icon.SIZE_STANDARD;
        const iconRootStyles = { width: iconSize + 4, height: iconSize + 4 };

        const stateClasses = classNames(
            active ? Classes.STEP_ACTIVE : '',
            completed ? Classes.STEP_COMPLETED : '',
            error ? Classes.STEP_ERROR : '',
        );

        return (
            <div {...divProps} className={classNames(className, Classes.STEP, stateClasses)}>
                {!children && connector}
                <span className={Classes.STEP_LABEL_ROOT}>
                    {icon ? (
                        <span style={iconRootStyles} className={classNames(Classes.STEP_ICON_ROOT, stateClasses)}>
                            <Icon icon={icon} iconSize={iconSize} />
                        </span>
                    ) : (
                        <span style={iconRootStyles} className={classNames(Classes.STEP_ICON_DOT_ROOT, stateClasses)}>
                            <div className={classNames(Classes.STEP_ICON_DOT, stateClasses)} />
                        </span>
                    )}
                    <span className={Classes.STEP_LABEL_CONTAINER}>
                        <span className={classNames(Classes.STEP_LABEL, stateClasses)}>{label}</span>
                        {labelInfo && <div className={Classes.TEXT_MUTED}>{labelInfo}</div>}
                    </span>
                </span>
                {children && (
                    <Collapse isOpen={active} className={classNames(Classes.STEP_CONTENT, contentClassName)} {...restContentProps}>
                        {children}
                    </Collapse>
                )}
            </div>
        );
    }
}
