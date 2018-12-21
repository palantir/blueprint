/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Button } from "@blueprintjs/core";
import * as React from "react";
import { NavbarElementProps } from "react-day-picker/types/props";

import classNames from "classnames";
import * as Classes from "./common/classes";
import { areSameMonth } from "./common/dateUtils";

export interface IDatePickerNavbarProps extends NavbarElementProps {
    maxDate: Date;
    minDate: Date;

    hideLeftNavButton?: boolean;
    hideRightNavButton?: boolean;
}

export class DatePickerNavbar extends React.PureComponent<IDatePickerNavbarProps> {
    public render() {
        const { classNames: classes, month, maxDate, minDate } = this.props;

        return (
            <div className={classNames(Classes.DATEPICKER_NAVBAR, classes.navBar)}>
                {this.props.hideLeftNavButton || (
                    <Button
                        className={classes.navButtonPrev}
                        disabled={areSameMonth(month, minDate)}
                        icon="chevron-left"
                        minimal={true}
                        onClick={this.handlePreviousClick}
                    />
                )}
                {this.props.hideRightNavButton || (
                    <Button
                        className={classes.navButtonNext}
                        disabled={areSameMonth(month, maxDate)}
                        icon="chevron-right"
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
