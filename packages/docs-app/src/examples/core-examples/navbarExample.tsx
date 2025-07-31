/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import dedent from "dedent";
import { useState } from "react";

import {
    Alignment,
    Button,
    Classes,
    H5,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Switch,
} from "@blueprintjs/core";
import { CodeExample, Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

export const NavbarExample: React.FC<ExampleProps> = props => {
    const [alignEnd, setAlignEnd] = useState(false);

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={alignEnd} label="Align end" onChange={handleBooleanChange(setAlignEnd)} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <Navbar>
                <NavbarGroup align={alignEnd ? Alignment.END : Alignment.START}>
                    <NavbarHeading>Blueprint</NavbarHeading>
                    <NavbarDivider />
                    <Button icon="home" text="Home" variant="minimal" />
                    <Button icon="document" text="Files" variant="minimal" />
                </NavbarGroup>
            </Navbar>
        </Example>
    );
};

export const NavbarFixedWidthExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Navbar>
            <div style={{ margin: "0 auto", width: 480 }}>
                {/* Add me */}
                <NavbarGroup>
                    <NavbarHeading>Blueprint</NavbarHeading>
                </NavbarGroup>
                <NavbarGroup align={Alignment.END}>
                    <Button icon="home" text="Home" variant="minimal" />
                    <Button icon="document" text="Files" variant="minimal" />
                    <NavbarDivider />
                    <Button icon="user" variant="minimal" />
                    <Button icon="notifications" variant="minimal" />
                    <Button icon="cog" variant="minimal" />
                </NavbarGroup>
            </div>
        </Navbar>`;
    return (
        <CodeExample code={code} {...props}>
            <div className={Classes.DARK}>
                <Navbar>
                    <div style={{ margin: "0 auto", width: 480 }}>
                        {/* Add me */}
                        <NavbarGroup>
                            <NavbarHeading>Blueprint</NavbarHeading>
                        </NavbarGroup>
                        <NavbarGroup align={Alignment.END}>
                            <Button icon="home" text="Home" variant="minimal" />
                            <Button icon="document" text="Files" variant="minimal" />
                            <NavbarDivider />
                            <Button icon="user" variant="minimal" />
                            <Button icon="notifications" variant="minimal" />
                            <Button icon="cog" variant="minimal" />
                        </NavbarGroup>
                    </div>
                </Navbar>
            </div>
        </CodeExample>
    );
};
