import { Listogram, type ListogramItem, type ListogramItemId } from "@blueprintjs/labs";

const ITEMS: ListogramItem[] = [
    { count: 7, title: "Apples" },
    { count: 6, title: "Strawberries and Cream" },
    { count: 3, title: "Apricots" },
    { count: 2, title: "Pears" },
    { count: 2, title: "Oranges" },
    { count: 1, title: "Cherries" },
].map((item, index) => ({ id: index.toString() as ListogramItemId, ...item }));

const SELECTED = new Set<ListogramItemId>(["0", "2"] as ListogramItemId[]);

export default function ListogramSelectionIntent() {
    return (
        <div className="group">
            <Listogram
                items={ITEMS}
                title="Keeping (default)"
                selectionKind="toggle"
                selectedItemIds={SELECTED}
                defaultSelectionIntent="keeping"
            />
            <Listogram
                items={ITEMS}
                title="Excluding"
                selectionKind="toggle"
                selectedItemIds={SELECTED}
                defaultSelectionIntent="excluding"
            />
        </div>
    );
}
