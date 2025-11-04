import { Breadcrumbs } from "@blueprintjs/core";

export default function BreadcrumbsOverflow() {
    return (
        <div>
            <Breadcrumbs
                items={[
                    { text: "All files" },
                    { text: "Users" },
                    { text: "Janet" },
                    { text: "Photos" },
                    { text: "Wednesday" },
                    { current: true, text: "image.jpg" },
                ]}
                minVisibleItems={3}
            />
        </div>
    );
}
