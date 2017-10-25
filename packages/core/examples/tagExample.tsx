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

import { Classes, Intent, Tag } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

export class TagExample extends BaseExample<{ showTag?: boolean }> {
    public state = {
        showTag: true,
    };

    protected className = "docs-tag-example";

    protected renderExample() {
        return (
            <div>
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY}>
                    @jkillian
                </Tag>
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY}>
                    @adahiya
                </Tag>
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY}>
                    @ggray
                </Tag>
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY}>
                    @allorca
                </Tag>
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY}>
                    @bdwyer
                </Tag>
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY}>
                    @piotrk
                </Tag>
                {this.maybeRenderTag()}
            </div>
        );
    }

    private maybeRenderTag() {
        if (this.state.showTag) {
            return (
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY} onRemove={this.deleteTag}>
                    @dlipowicz
                </Tag>
            );
        } else {
            return undefined;
        }
    }

    private deleteTag = () => this.setState({ showTag: false });
}
