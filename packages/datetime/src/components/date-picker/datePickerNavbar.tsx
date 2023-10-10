/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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
import type { NavbarElementProps } from "react-day-picker";

import { Button } from "@blueprintjs/core";
import { ChevronLeft, ChevronRight } from "@blueprintjs/icons";

import { Classes, DateUtils } from "../../common";

export interface DatePickerNavbarProps extends NavbarElementProps {
    maxDate: Date;
    minDate: Date;

    hideLeftNavButton?: boolean;
    hideRightNavButton?: boolean;
}

export class DatePickerNavbar extends React.PureComponent<DatePickerNavbarProps> {
    public render() {
        const { classNames: classes, month, maxDate, minDate } = this.props;

        return (
            <div className={classNames(Classes.DATEPICKER_NAVBAR, classes.navBar)}>
                {this.props.hideLeftNavButton || (
                    <Button
                        aria-label="Go to previous month"
                        className={classes.navButtonPrev}
                        disabled={DateUtils.isSameMonth(month, minDate)}
                        icon={<ChevronLeft />}
                        minimal={true}
                        onClick={this.handlePreviousClick}
                    />
                )}
                {this.props.hideRightNavButton || (
                    <Button
                        aria-label="Go to next month"
                        className={classes.navButtonNext}
                        disabled={DateUtils.isSameMonth(month, maxDate)}
                        icon={<ChevronRight />}
                        minimal={true}
                        onClick={this.handleNextClick}
                    />
                )}
            </div>
        );
    }

    private handleNextClick = () => this.props.onNextClick();

    private handlePreviousClick = () => this.props.onPreviousClick();
}
