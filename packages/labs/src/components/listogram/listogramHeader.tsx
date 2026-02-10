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

import * as React from "react";

import { AbstractPureComponent, Button, H6 } from "@blueprintjs/core";

import { LISTOGRAM_HEADER, LISTOGRAM_HEADER_TITLE, LISTOGRAM_SORT_CONTROLS_BUTTON } from "./listogramClasses";
import { ListogramSortControls } from "./listogramSortControls";
import type { ListogramSortProps } from "./listogramSortUtils";

export interface ListogramHeaderProps {
    sortProps: ListogramSortProps | undefined;
    title: React.ReactNode;
}

export interface ListogramHeaderState {
    isSortControlsOpen: boolean;
}

export class ListogramHeader extends AbstractPureComponent<ListogramHeaderProps, ListogramHeaderState> {
    public state: ListogramHeaderState = {
        isSortControlsOpen: false,
    };

    public render() {
        const { sortProps, title } = this.props;
        const { isSortControlsOpen } = this.state;

        const enableSorts = sortProps !== undefined;

        return (
            <div className={LISTOGRAM_HEADER}>
                <H6 className={LISTOGRAM_HEADER_TITLE}>
                    {title}
                    <div>
                        {enableSorts && (
                            <Button
                                active={isSortControlsOpen}
                                className={LISTOGRAM_SORT_CONTROLS_BUTTON}
                                icon="sort"
                                variant="minimal"
                                onClick={this.handleSortMenuButtonClick}
                            />
                        )}
                    </div>
                </H6>
                {enableSorts && isSortControlsOpen && (
                    <ListogramSortControls
                        sortKindLabels={sortProps.sortKindLabels}
                        onSortChange={sortProps.onSortChange}
                        sortDirection={sortProps.sortDirection}
                        sortKind={sortProps.sortKind}
                        areTitlesSortable={sortProps.areTitlesSortable}
                    />
                )}
            </div>
        );
    }

    private handleSortMenuButtonClick = () => {
        this.setState(prevState => ({
            isSortControlsOpen: !prevState.isSortControlsOpen,
        }));
    };
}
