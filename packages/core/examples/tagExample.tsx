/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import { Classes, Intent, Tag } from "../src";
import BaseExample from "./common/baseExample";

export class TagExample extends BaseExample<{ showTag?: boolean }> {
    public state = {
        showTag: true,
    };

    protected className = "docs-tag-example";

    protected renderExample() {
        return (
            <div>
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY}>@jkillian</Tag>
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY}>@adahiya</Tag>
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY}>@ggray</Tag>
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY}>@allorca</Tag>
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY}>@bdwyer</Tag>
                <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY}>@piotrk</Tag>
                {this.maybeRenderTag()}
            </div>
        );
    }

    private maybeRenderTag() {
        if (this.state.showTag) {
            return <Tag className={Classes.MINIMAL} intent={Intent.PRIMARY} onRemove={this.deleteTag}>@dlipowicz</Tag>;
        } else {
            return undefined;
        }
    }

    private deleteTag = () => this.setState({ showTag: false });
}
