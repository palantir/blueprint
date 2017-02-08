import { IInterfaceEntry, IPropertyEntry } from "ts-quick-docs/dist/interfaces";

export class PropsStore {
    constructor(private props: IInterfaceEntry[]) {}

    public getProps = (name: string): IPropertyEntry[] => {
        const entry = this.props.filter((props) => props.name === name)[0];
        if (entry == null) {
            return [];
        } else if (entry.extends == null) {
            return entry.properties;
        } else {
            // dirty deduplication for overridden/inherited props
            const props: {[name: string]: IPropertyEntry} = {};
            entry.extends.map(this.getInheritedProps).forEach((inherited) => {
                inherited.forEach((prop) => props[prop.name] = prop);
            });
            entry.properties.forEach((prop) => props[prop.name] = prop);
            // return a sorted array of unique props
            return Object.keys(props).sort().map((n) => props[n]);
        }
    }

    private getInheritedProps = (name: string) => {
        return this.getProps(name).map((p) => {
            p.inheritedFrom = name;
            return p;
        });
    }
}
