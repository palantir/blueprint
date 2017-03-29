import { ITsInterfaceEntry, ITsPropertyEntry } from "documentalist/dist/plugins/typescript";

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
