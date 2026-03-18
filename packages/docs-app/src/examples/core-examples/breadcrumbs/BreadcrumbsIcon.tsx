import { Breadcrumbs } from "@blueprintjs/core";

export default function BreadcrumbsIcon() {
    return (
        <Breadcrumbs
            items={[
                { href: "#", icon: "folder-close", text: "All files" },
                { href: "#", icon: "folder-close", text: "Users" },
                { href: "#", icon: "folder-close", text: "Janet" },
                { icon: "document", text: "image.jpg" },
            ]}
        />
    );
}
