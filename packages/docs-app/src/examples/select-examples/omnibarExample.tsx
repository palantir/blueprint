/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { Button, Classes, H5, HotkeysTarget, KeyComboTag, MenuItem, OverlayToaster, Switch } from "@blueprintjs/core";
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

export const OmnibarExample: React.FC<ExampleProps<BlueprintExampleData>> = props => {
    const useDarkTheme = props.data.themeName === Classes.DARK;

    const [allowCreate, setAllowCreate] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [overlayHasBackdrop, setOverlayHasBackdrop] = React.useState(true);
    const [resetOnSelect, setResetOnSelect] = React.useState(true);

    const toaster = React.useMemo(
        () => OverlayToaster.create({ className: classNames({ [Classes.DARK]: useDarkTheme }) }),
        [useDarkTheme],
    );

    const handleOpen = React.useCallback(() => setIsOpen(true), []);

    const handleClose = React.useCallback(() => setIsOpen(false), []);

    const handleItemSelect = React.useCallback(
        async (film: Film) => {
            setIsOpen(false);

            (await toaster).show({
                message: (
                    <span>
                        You selected <strong>{film.title}</strong>.
                    </span>
                ),
            });
        },
        [toaster],
    );

    const options = (
        <>
            <H5>Props</H5>
            <Switch label="Reset on select" checked={resetOnSelect} onChange={handleBooleanChange(setResetOnSelect)} />
            <Switch
                label="Allow creating new films"
                checked={allowCreate}
                onChange={handleBooleanChange(setAllowCreate)}
            />
            <H5>Overlay props</H5>
            <Switch
                label="Has backdrop"
                checked={overlayHasBackdrop}
                onChange={handleBooleanChange(setOverlayHasBackdrop)}
            />
        </>
    );

    return (
        <HotkeysTarget
            hotkeys={[
                {
                    combo: "shift + o",
                    global: true,
                    label: "Show Omnibar",
                    onKeyDown: handleOpen,
                    // prevent typing "O" in omnibar input
                    preventDefault: true,
                },
            ]}
        >
            <Example options={options} {...props}>
                <span>
                    <Button text="Click to show Omnibar" onClick={handleOpen} />
                    {" or press "}
                    <KeyComboTag combo="shift + o" />
                </span>

                <Omnibar
                    className={classNames({ [Classes.DARK]: useDarkTheme })}
                    createNewItemFromQuery={allowCreate ? createFilm : undefined}
                    createNewItemRenderer={allowCreate ? renderCreateFilmMenuItem : null}
                    isOpen={isOpen}
                    itemPredicate={filterFilm}
                    itemRenderer={renderFilm}
                    items={TOP_100_FILMS}
                    itemsEqual={areFilmsEqual}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onClose={handleClose}
                    onItemSelect={handleItemSelect}
                    overlayProps={{ hasBackdrop: overlayHasBackdrop }}
                    resetOnSelect={resetOnSelect}
                />
            </Example>
        </HotkeysTarget>
    );
};
