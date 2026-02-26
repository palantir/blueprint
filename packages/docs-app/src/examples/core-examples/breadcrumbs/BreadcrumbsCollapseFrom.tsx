import { Boundary, Breadcrumbs } from "@blueprintjs/core";

const ITEMS = [
    { text: "All files" },
    { text: "Users" },
    { text: "Janet" },
    { text: "Photos" },
    { text: "Wednesday" },
    { text: "image.jpg" },
];

export default function BreadcrumbsCollapseFrom() {
    return (
        <div>
            <Breadcrumbs items={ITEMS} collapseFrom={Boundary.START} />
            <br />
            <Breadcrumbs items={ITEMS} collapseFrom={Boundary.END} />
        </div>
    );
}
