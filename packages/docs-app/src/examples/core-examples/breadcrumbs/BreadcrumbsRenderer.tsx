import { Breadcrumb, Breadcrumbs, Icon } from "@blueprintjs/core";

export default function BreadcrumbsRenderer() {
    return (
        <Breadcrumbs
            currentBreadcrumbRenderer={({ text, ...rest }) => (
                <Breadcrumb {...rest}>
                    {text}&nbsp;
                    <Icon icon="star" />
                </Breadcrumb>
            )}
            items={[
                { href: "/users", icon: "folder-close", text: "Users" },
                { href: "/users/janet", icon: "folder-close", text: "Janet" },
                { icon: "document", text: "image.jpg" },
            ]}
        />
    );
}
