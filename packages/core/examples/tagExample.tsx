/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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
