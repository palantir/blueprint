import { useState } from "react";

import { Button, Popover } from "@blueprintjs/core";
import { ChevronDown } from "@blueprintjs/icons";
import { Listogram, type ListogramItem, type ListogramItemId } from "@blueprintjs/labs";

const ITEMS: ListogramItem[] = [
    { count: 7, title: "Apples" },
    { count: 6, title: "Strawberries and Cream" },
    { count: 3, title: "Apricots" },
    { count: 2, title: "Pears" },
    { count: 2, title: "Oranges" },
    { count: 1, title: "Cherries" },
].map((item, index) => ({ id: index.toString() as ListogramItemId, ...item }));

export default function ListogramPopover() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover
            isOpen={isOpen}
            minimal={true}
            onClose={() => setIsOpen(false)}
            content={<Listogram items={ITEMS} title="Fruits" />}
        >
            <Button
                text="Select fruits"
                rightIcon={<ChevronDown />}
                onClick={() => setIsOpen(true)}
            />
        </Popover>
    );
}
