import { Listogram, type ListogramItem, type ListogramItemId } from "@blueprintjs/labs";

const ITEMS: ListogramItem[] = [
    { count: 7, title: "Apples" },
    { count: 6, title: "Strawberries and Cream" },
    { count: 3, title: "Apricots" },
    { count: 2, title: "Pears" },
    { count: 2, title: "Oranges" },
    { count: 1, title: "Cherries" },
].map((item, index) => ({ id: index.toString() as ListogramItemId, ...item }));

export default function ListogramSorting() {
    return <Listogram items={ITEMS} title="Fruits" enableSorts={true} defaultSortKind="count" />;
}
