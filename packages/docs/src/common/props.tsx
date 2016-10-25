import { IInterfaceEntry, IPropertyEntry } from "ts-quick-docs/src/interfaces";

// tslint:disable-next-line:no-var-requires
const PROPS = require<IInterfaceEntry[]>("../generated/props.json");

function getInheritedProps(name: string) {
    return getProps(name).map((p) => {
        p.inheritedFrom = name;
        return p;
    });
}

export function getProps(name: string): IPropertyEntry[] {
    const entry = PROPS.filter((props) => props.name === name)[0];
    if (entry == null) {
        return [];
    } else if (entry.extends == null) {
        return entry.properties;
    } else {
        // dirty deduplication for overridden/inherited props
        const props: {[name: string]: IPropertyEntry} = {};
        entry.extends.map(getInheritedProps).forEach((inherited) => {
            inherited.forEach((prop) => props[prop.name] = prop);
        });
        entry.properties.forEach((prop) => props[prop.name] = prop);
        // return a sorted array of unique props
        return Object.keys(props).sort().map((n) => props[n]);
    }
}
