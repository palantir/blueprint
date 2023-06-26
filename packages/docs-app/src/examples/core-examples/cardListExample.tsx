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

import { Button, Card, CardList, Classes, H6, Icon, Intent, Tag } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

export class CardListExample extends React.PureComponent<ExampleProps> {
    public render() {
        return (
            <Example {...this.props}>
                <Card style={{ padding: 0, width: "100%" }}>
                    <div style={{ padding: "10px 20px" }}>
                        <H6 style={{ marginBottom: 0 }}>My french reciepes</H6>
                    </div>
                    <CardList contained={true}>
                        <Card interactive={true} style={{ justifyContent: "space-between" }}>
                            <span>Chicken Basquaise</span>
                            <Icon icon={IconNames.CHEVRON_RIGHT} className={Classes.TEXT_MUTED} />
                        </Card>
                        <Card interactive={true} style={{ justifyContent: "space-between" }}>
                            <span>Tarte Flambée</span>
                            <Icon icon={IconNames.CHEVRON_RIGHT} className={Classes.TEXT_MUTED} />
                        </Card>
                        <Card interactive={true} style={{ justifyContent: "space-between" }}>
                            <span>Pain au Chocolat</span>
                            <Icon icon={IconNames.CHEVRON_RIGHT} className={Classes.TEXT_MUTED} />
                        </Card>
                    </CardList>
                </Card>

                <CardList>
                    <Card style={{ justifyContent: "space-between" }}>
                        <span>Olive oil</span>
                        <Button minimal={true} intent={Intent.PRIMARY}>
                            Add
                        </Button>
                    </Card>
                    <Card style={{ justifyContent: "space-between" }}>
                        <span>Ground black pepper</span>
                        <Button minimal={true} intent={Intent.PRIMARY}>
                            Add
                        </Button>
                    </Card>
                    <Card style={{ justifyContent: "space-between" }}>
                        <span>Carrots</span>
                        <Tag intent={Intent.SUCCESS} minimal={true}>
                            Added
                        </Tag>
                    </Card>
                    <Card style={{ justifyContent: "space-between" }}>
                        <span>Onions</span>
                        <Button minimal={true} intent={Intent.PRIMARY}>
                            Add
                        </Button>
                    </Card>
                </CardList>
            </Example>
        );
    }
}
