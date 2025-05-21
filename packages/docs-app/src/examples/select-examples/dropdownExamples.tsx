/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";
import { noop } from "lodash";
import * as React from "react";

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";
import { Dropdown } from "@blueprintjs/select";

export const DropdownBasicExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        const names = ["Alice", "Bob", "Courtney", "David"];
        const [selectedName, setSelectedName] = React.useState(names[0]);
        <Dropdown items={names} onItemSelect={setSelectedName} selectedValue={selectedName} />`;

    const names = ["Alice", "Bob", "Courtney", "David"];
    const [selectedName, setSelectedName] = React.useState(names[0]);
    return (
        <CodeExample code={code} {...props}>
            <Dropdown items={names} onItemSelect={setSelectedName} selectedItem={selectedName} />
        </CodeExample>
    );
};

export const DropdownLabelExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        type Person = { id: number; name: string; age: number; };
        const people: Person[] = [/* ... */];
        <Dropdown items={people} {/* ... */} itemLabel="name" itemKey="id" />
        `;

    type Person = { id: number; name: string; age: number };
    const people = ["Alice", "Bob", "Courtney", "David"].map(
        (name, index): Person => ({ age: (index + 1) * 10, id: index, name }),
    );
    const [selectedPerson, setSelectedPerson] = React.useState(people[0]);
    return (
        <CodeExample code={code} {...props}>
            <Dropdown
                items={people}
                onItemSelect={setSelectedPerson}
                selectedItem={selectedPerson}
                itemLabel="name"
                itemKey="id"
            />
        </CodeExample>
    );
};

export const DropdownFillExample: React.FC<ExampleProps> = props => {
    const code = `<Dropdown items={["Alice", "Bob", "Courtney"]} fill={true} />`;

    return (
        <CodeExample code={code} {...props}>
            <Dropdown items={["Alice", "Bob", "Courtney"]} fill={true} selectedItem="Alice" onItemSelect={noop} />
        </CodeExample>
    );
};

export const DropdownDisabledExample: React.FC<ExampleProps> = _props => {
    return null;
};
