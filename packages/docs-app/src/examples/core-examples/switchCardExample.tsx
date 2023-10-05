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

import * as React from "react";

import { CardList, H5, Switch, SwitchCard } from "@blueprintjs/core";
import { Example, ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

interface SwitchCardExampleState {
    // TODO: add compact option
    // compact: boolean;
    cardListCompact: boolean;
    disabled: boolean;
    switchChecked: boolean[];
}

export class SwitchCardExample extends React.PureComponent<ExampleProps, SwitchCardExampleState> {
    public state: SwitchCardExampleState = {
        // TODO: add compact option
        // compact: false,
        cardListCompact: false,
        disabled: false,
        switchChecked: [false, true, false, true, true, false],
    };

    public render() {
        const { cardListCompact, disabled, switchChecked } = this.state;
        const sharedProps = { disabled };

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <div className="docs-control-card-grid">
                    <SwitchCard {...sharedProps} onChange={this.getSwitchChangeHandler(0)} checked={switchChecked[0]}>
                        Wifi
                    </SwitchCard>
                    <SwitchCard {...sharedProps} onChange={this.getSwitchChangeHandler(1)} checked={switchChecked[1]}>
                        Bluetooth
                    </SwitchCard>
                    <SwitchCard {...sharedProps} onChange={this.getSwitchChangeHandler(2)} checked={switchChecked[2]}>
                        NFC
                    </SwitchCard>
                </div>

                <CardList compact={cardListCompact}>
                    <SwitchCard {...sharedProps} onChange={this.getSwitchChangeHandler(3)} checked={switchChecked[3]}>
                        Wifi
                    </SwitchCard>
                    <SwitchCard {...sharedProps} onChange={this.getSwitchChangeHandler(4)} checked={switchChecked[4]}>
                        Bluetooth
                    </SwitchCard>
                    <SwitchCard {...sharedProps} onChange={this.getSwitchChangeHandler(5)} checked={switchChecked[5]}>
                        NFC
                    </SwitchCard>
                </CardList>
            </Example>
        );
    }

    private renderOptions() {
        const { cardListCompact, disabled } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch checked={disabled} label="Disabled" onChange={this.toggleDisabled} />
                <H5>CardList Props</H5>
                <Switch checked={cardListCompact} label="Compact" onChange={this.toggleCardListCompact} />
            </>
        );
    }

    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));

    private toggleCardListCompact = handleBooleanChange(cardListCompact => this.setState({ cardListCompact }));

    private getSwitchChangeHandler = (index: number) => () => {
        const switchChecked = [...this.state.switchChecked];
        switchChecked[index] = !this.state.switchChecked[index];

        this.setState({ switchChecked });
    };
}
