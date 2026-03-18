import { Breadcrumbs } from "@blueprintjs/core";

export default function BreadcrumbsDisabled() {
    return (
        <Breadcrumbs
            items={[
                { href: "#", text: "Home" },
                { disabled: true, href: "#", text: "Archived" },
                { href: "#", text: "Projects" },
                { text: "Current project" },
            ]}
        />
    );
}
