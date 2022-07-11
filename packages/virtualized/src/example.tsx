/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

// Class name management
import classNames from "classnames";
import * as Classes from "./common/classes";
import * as Errors from "./common/errors";

import * as React from "react";

import { DISPLAYNAME_PREFIX, Props } from "@blueprintjs/core";
import type { ColumnProps } from "./../../table/src/column"; // TODO : to change

// Properties of the component
export interface IVirtualizedTableProps extends Props {
    /**
     * Some example property
     *
     * @default ""
     */
    title?: string;
}
// TODO : ask why. Is that just a way to instanciate a set of properties ?
export type VirtualizedTableProps = IVirtualizedTableProps;

// State of the component
export interface IVirtualizedTableState {
    // e.g. defines the content of the components : an array of data, for a table.
    childrenArray: Array<React.ReactElement<ColumnProps>>;
}

export class VirtualizedTable extends React.Component<IVirtualizedTableProps, IVirtualizedTableState> {
    // Some convention for having a displayName of the widget
    public static displayName = `${DISPLAYNAME_PREFIX}.VirtualizedTable`;

    // Default properties values of the Component
    public static defaultProps: VirtualizedTableProps = {
        title: "default Title",
    };

    // Constructor of the component
    public constructor(props?: VirtualizedTableProps, context?: any) {
        // Call the parent constructor
        super(props, context);

        // Set the state's values (potentially from the properties values)
        // if (props.children !== undefined) {
        //   childrenArray =  props.children;
        // }
        // Or hardcoded, e.g. here empty array :
        this.state = {
            childrenArray: [],
        };
    }

    public render() {
        // Load the properties and state into memory
        const { title } = this.props;
        const { childrenArray } = this.state;

        // Return some HTML with potentially other react components definition
        return (
            <div className={classNames(Classes.VIRTUALIZED_TABLE, "root")}>
                {title} : {childrenArray}
            </div>
        );
        // E.g.
        /* (
        <div className={classNames(Classes.DATEPICKER, className)}>
            {this.maybeRenderShortcuts()}
            <div className={Classes.DATEPICKER_CONTENT}>
                <DayPicker
                  showOutsideDays={true}
                />
                {this.maybeRenderTimePicker()}
                {showActionsBar && this.renderOptionsBar()}
                {footerElement}
            </div>
        </div>
    );*/
    }

    public componentDidUpdate(prevProps: VirtualizedTableProps, prevState: IVirtualizedTableState) {
        // call the parent's method
        super.componentDidUpdate(prevProps, prevState);
        // add on top the behavior specific to this child component

        // Load the new properties and state into memory
        const { title } = this.props;

        if (title === prevProps.title) {
            // no action needed : the value is the same as before
            return;
        } else {
            // update to the title > clear the state (non-sense behavior but just as an example)
            this.setState({ childrenArray: [] });
        }
    }

    protected validateProps(props: VirtualizedTableProps) {
        const { title } = props;

        // do cheap error-checking first.
        if (props == undefined) {
            throw new Error(Errors.PROPS_UNDEFINED);
        }

        // do cheap error-checking first.
        if (title == null) {
            throw new Error(Errors.EMPTY_TITLE);
        }
    }
}
