import { Breadcrumbs } from "@blueprintjs/core";

export default function BreadcrumbsBasic() {
    return (
        <div>
            <Breadcrumbs
                items={[
                    { text: "Blueprint" },
                    { text: "Docs" },
                    { text: "Components" },
                    { text: "Breadcrumbs" },
                ]}
            />
        </div>
    );
}
