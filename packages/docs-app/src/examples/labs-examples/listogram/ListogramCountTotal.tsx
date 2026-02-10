import { Listogram, type ListogramItem, type ListogramItemId } from "@blueprintjs/labs";

const FRUITS: ListogramItem[] = [
    { count: 7, title: "Apples" },
    { count: 3, title: "Oranges" },
].map((item, index) => ({ id: `f${index}` as ListogramItemId, ...item }));

const VEGETABLES: ListogramItem[] = [
    { count: 10, title: "Carrots" },
    { count: 4, title: "Broccoli" },
].map((item, index) => ({ id: `v${index}` as ListogramItemId, ...item }));

export default function ListogramCountTotal() {
    return (
        <div className="group">
            <Listogram items={FRUITS} title="Fruits" countTotal={10} />
            <Listogram items={VEGETABLES} title="Vegetables" countTotal={10} />
        </div>
    );
}
