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

import { ITsInterfaceEntry, ITsPropertyEntry } from "documentalist/dist/client";

export interface IInheritedPropertyEntry extends ITsPropertyEntry {
    inheritedFrom?: string;
}

export class PropsStore {
    constructor(private props: { [name: string]: ITsInterfaceEntry }) {}

    public getInterface = (name: string) => {
        // TODO: need better library support for this https://github.com/giladgray/ts-quick-docs/issues/25
        // remove generics from end of name
        const actualName = /^(\w+)<?/.exec(name)[1];
        return this.props[actualName];
    };

    public getProps = (entry: ITsInterfaceEntry): IInheritedPropertyEntry[] => {
        if (entry == null) {
            return [];
        } else if (entry.extends == null) {
            return entry.properties;
        } else {
            // dirty deduplication for overridden/inherited props
            const props: { [name: string]: ITsPropertyEntry } = {};
            entry.extends.map(this.getInheritedProps).forEach(inherited => {
                inherited.forEach(prop => (props[prop.name] = prop));
            });
            entry.properties.forEach(prop => (props[prop.name] = prop));
            // return a sorted array of unique props
            return Object.keys(props)
                .sort()
                .map(n => props[n]);
        }
    };

    private getInheritedProps = (name: string) => {
        return this.getProps(this.getInterface(name)).map((p: IInheritedPropertyEntry) => {
            p.inheritedFrom = name;
            return p;
        });
    };
}
