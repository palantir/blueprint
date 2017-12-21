/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { ITsClass, ITsInterface, ITsProperty, ITypescriptPluginData } from "documentalist/dist/client";

export class PropsStore {
    constructor(private props: ITypescriptPluginData["typescript"]) {}

    public getInterface = (name: string): ITsClass | ITsInterface => {
        // TODO: need better library support for this https://github.com/giladgray/ts-quick-docs/issues/25
        // remove generics from end of name
        const actualName = /^(\w+)<?/.exec(name)[1];
        console.log(name, actualName);
        return this.props[actualName];
    };

    public getProps = (entry: ITsClass | ITsInterface): ITsProperty[] => {
        if (entry == null) {
            return [];
        } else {
            // dirty deduplication for overridden/inherited props
            const props: { [name: string]: ITsProperty } = {};
            entry.properties.forEach(prop => (props[prop.name] = prop));
            // return a sorted array of unique props
            return Object.keys(props)
                .sort()
                .map(n => props[n]);
        }
    };
}
