import { Breadcrumbs, Classes } from "@blueprintjs/core";

export default function BreadcrumbsPopover() {
    return (
        <div style={{ maxWidth: 300 }}>
            <Breadcrumbs
                items={[
                    { href: "#", text: "Janet" },
                    { href: "#", text: "Photos" },
                    { href: "#", text: "Wednesday" },
                    { text: "image.jpg" },
                ]}
                popoverProps={{ className: Classes.POPOVER_DISMISS, placement: "left" }}
            />
        </div>
    );
}
