/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { H5, InputGroup, Switch } from "@blueprintjs/core";
import { Example, ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

interface SearchInputExampleProps {
    disabled: boolean;
    readOnly: boolean;
    large: boolean;
    small: boolean;
}

export class SearchInputExample extends React.PureComponent<ExampleProps, SearchInputExampleProps> {
    public state: SearchInputExampleProps = {
        disabled: false,
        large: false,
        readOnly: false,
        small: false,
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));

    private handleReadOnlyChange = handleBooleanChange(readOnly => this.setState({ readOnly }));

    private handleLargeChange = handleBooleanChange(large => this.setState({ large, ...(large && { small: false }) }));

    private handleSmallChange = handleBooleanChange(small => this.setState({ small, ...(small && { large: false }) }));

    public render() {
        const { disabled, large, readOnly, small } = this.state;

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <InputGroup
                    disabled={disabled}
                    large={large}
                    placeholder="Search..."
                    readOnly={readOnly}
                    small={small}
                    type="search"
                />
            </Example>
        );
    }

    private renderOptions() {
        const { disabled, readOnly, large, small } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch label="Disabled" onChange={this.handleDisabledChange} checked={disabled} />
                <Switch label="Read-only" onChange={this.handleReadOnlyChange} checked={readOnly} />
                <Switch label="Large" onChange={this.handleLargeChange} checked={large} />
                <Switch label="Small" onChange={this.handleSmallChange} checked={small} />
            </>
        );
    }
}
