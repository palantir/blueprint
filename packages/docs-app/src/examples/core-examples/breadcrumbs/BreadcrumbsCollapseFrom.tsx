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
        <div style={{ maxWidth: 350 }}>
            <Breadcrumbs items={ITEMS} collapseFrom={Boundary.START} />
            <br />
            <Breadcrumbs items={ITEMS} collapseFrom={Boundary.END} />
        </div>
    );
}
