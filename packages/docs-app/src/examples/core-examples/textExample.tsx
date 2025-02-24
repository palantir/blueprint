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

import * as React from "react";

import { Button, Menu, MenuItem, Popover, Text, TextArea } from "@blueprintjs/core";
import { Example, type ExampleProps, handleStringChange } from "@blueprintjs/docs-theme";
import { type Film, TOP_100_FILMS } from "@blueprintjs/select/examples";

export const TextExample: React.FC<ExampleProps> = props => {
    const [textContent, setTextContent] = React.useState(
        "You can change the text in the input below. Hover to see full text. " +
            "If the text is long enough, then the content will overflow. This is done by setting " +
            "ellipsize to true.",
    );

    const handleChange = handleStringChange((text: string) => setTextContent(text));

    return (
        <Example options={false} {...props}>
            <Text ellipsize={true}>
                {textContent}
                &nbsp;
            </Text>
            <TextArea fill={true} onChange={handleChange} value={textContent} />
            <Popover
                content={
                    <Menu className="docs-text-example-dropdown-menu">
                        {TOP_100_FILMS.map((film: Film) => (
                            <MenuItem key={film.rank} text={film.title} />
                        ))}
                    </Menu>
                }
                placement="bottom"
            >
                <Button icon="media" text="Text is used in MenuItems, and is performant at scale in long lists" />
            </Popover>
        </Example>
    );
};
