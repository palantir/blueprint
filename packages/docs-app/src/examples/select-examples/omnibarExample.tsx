/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import {
    Button,
    Classes,
    H5,
    HotkeysTarget2,
    KeyComboTag,
    MenuItem,
    OverlayToaster,
    Position,
    Switch,
    type Toaster,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { Omnibar } from "@blueprintjs/select";
import {
    areFilmsEqual,
    createFilm,
    type Film,
    filterFilm,
    renderCreateFilmMenuItem,
    renderFilm,
    TOP_100_FILMS,
} from "@blueprintjs/select/examples";

import type { BlueprintExampleData } from "../../tags/types";

export interface OmnibarExampleState {
    allowCreate: boolean;
    isOpen: boolean;
    overlayHasBackdrop: boolean;
    resetOnSelect: boolean;
}

export class OmnibarExample extends React.PureComponent<ExampleProps<BlueprintExampleData>, OmnibarExampleState> {
    public state: OmnibarExampleState = {
        allowCreate: false,
        isOpen: false,
        overlayHasBackdrop: true,
        resetOnSelect: true,
    };

    private handleAllowCreateChange = handleBooleanChange(allowCreate => this.setState({ allowCreate }));

    private handleOverlayHasBackdropChange = handleBooleanChange(overlayHasBackdrop =>
        this.setState({ overlayHasBackdrop }),
    );

    private handleResetChange = handleBooleanChange(resetOnSelect => this.setState({ resetOnSelect }));

    private toaster: Toaster;

    private refHandlers = {
        toaster: (ref: Toaster) => (this.toaster = ref),
    };

    public render() {
        const { allowCreate, overlayHasBackdrop } = this.state;

        const maybeCreateNewItemFromQuery = allowCreate ? createFilm : undefined;
        const maybeCreateNewItemRenderer = allowCreate ? renderCreateFilmMenuItem : null;
        const useDarkTheme = this.props.data.themeName === Classes.DARK;

        return (
            <HotkeysTarget2
                hotkeys={[
                    {
                        combo: "shift + o",
                        global: true,
                        label: "Show Omnibar",
                        onKeyDown: this.handleToggle,
                        // prevent typing "O" in omnibar input
                        preventDefault: true,
                    },
                ]}
            >
                <Example options={this.renderOptions()} {...this.props}>
                    <span>
                        <Button text="Click to show Omnibar" onClick={this.handleClick} />
                        {" or press "}
                        <KeyComboTag combo="shift + o" />
                    </span>

                    <Omnibar<Film>
                        {...this.state}
                        className={classNames({ [Classes.DARK]: useDarkTheme })}
                        createNewItemFromQuery={maybeCreateNewItemFromQuery}
                        createNewItemRenderer={maybeCreateNewItemRenderer}
                        itemPredicate={filterFilm}
                        itemRenderer={renderFilm}
                        items={TOP_100_FILMS}
                        itemsEqual={areFilmsEqual}
                        noResults={<MenuItem disabled={true} text="No results." />}
                        onClose={this.handleClose}
                        onItemSelect={this.handleItemSelect}
                        overlayProps={{ hasBackdrop: overlayHasBackdrop }}
                    />
                    <OverlayToaster
                        className={classNames({ [Classes.DARK]: useDarkTheme })}
                        position={Position.TOP}
                        ref={this.refHandlers.toaster}
                    />
                </Example>
            </HotkeysTarget2>
        );
    }

    protected renderOptions() {
        const { allowCreate, overlayHasBackdrop, resetOnSelect } = this.state;

        return (
            <>
                <H5>Props</H5>
                <Switch label="Reset on select" checked={resetOnSelect} onChange={this.handleResetChange} />
                <Switch
                    label="Allow creating new films"
                    checked={allowCreate}
                    onChange={this.handleAllowCreateChange}
                />
                <H5>Overlay props</H5>
                <Switch
                    label="Has backdrop"
                    checked={overlayHasBackdrop}
                    onChange={this.handleOverlayHasBackdropChange}
                />
            </>
        );
    }

    private handleClick = (_event: React.MouseEvent<HTMLElement>) => {
        this.setState({ isOpen: true });
    };

    private handleItemSelect = (film: Film) => {
        this.setState({ isOpen: false });

        this.toaster.show({
            message: (
                <span>
                    You selected <strong>{film.title}</strong>.
                </span>
            ),
        });
    };

    private handleClose = () => this.setState({ isOpen: false });

    private handleToggle = () => this.setState({ isOpen: !this.state.isOpen });
}
