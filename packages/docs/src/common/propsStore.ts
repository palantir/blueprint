/*
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { ITsInterfaceEntry, ITsPropertyEntry } from "documentalist/dist/client";

export interface IInheritedPropertyEntry extends ITsPropertyEntry {
    inheritedFrom?: string;
}

export class PropsStore {
    constructor(private props: { [name: string]: ITsInterfaceEntry }) {}

    public getProps = (name: string): IInheritedPropertyEntry[] => {
        const entry = this.props[name];
        if (entry == null) {
            return [];
        } else if (entry.extends == null) {
            return entry.properties;
        } else {
            // dirty deduplication for overridden/inherited props
            const props: {[name: string]: ITsPropertyEntry} = {};
            entry.extends.map(this.getInheritedProps).forEach((inherited) => {
                inherited.forEach((prop) => props[prop.name] = prop);
            });
            entry.properties.forEach((prop) => props[prop.name] = prop);
            // return a sorted array of unique props
            return Object.keys(props).sort().map((n) => props[n]);
        }
    }

    private getInheritedProps = (name: string) => {
        return this.getProps(name).map((p: IInheritedPropertyEntry) => {
            p.inheritedFrom = name;
            return p;
        });
    }
}
