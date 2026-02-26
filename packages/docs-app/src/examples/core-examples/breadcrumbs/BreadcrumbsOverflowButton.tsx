import { Breadcrumbs } from "@blueprintjs/core";

export default function BreadcrumbsOverflowButton() {
    return (
        <Breadcrumbs
            items={[
                { text: "All files" },
                { text: "Users" },
                { text: "Janet" },
                { text: "Photos" },
                { text: "Wednesday" },
                { text: "image.jpg" },
            ]}
            overflowButtonProps={{ "aria-label": "More breadcrumbs" }}
        />
    );
}
