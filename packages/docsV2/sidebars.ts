import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
    componentsSidebar: [
        {
            type: "category",
            label: "Components",
            items: ["card", "callout"],
        },
    ],
};

export default sidebars;
