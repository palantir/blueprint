import { Breadcrumbs, Classes } from "@blueprintjs/core";

export default function BreadcrumbsPopover() {
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
            popoverProps={{ className: Classes.POPOVER_DISMISS, placement: "bottom" }}
        />
    );
}
