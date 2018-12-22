import doczrc from "@blueprintjs/docz-theme/doczrc";

export default {
    ...doczrc,
    title: "Blueprint",
    wrapper: "src/wrapper",
    theme: "@blueprintjs/docz-theme",
    menu: [
        "Home",
        "Guides",
        {
            name: "Components",
            menu: [
                "Core",
                "Datetime",
                "Icons",
                "Select",
                "Table",
                "Timezone",
                "Labs",
            ],
        },
        "Resources",
    ]
};
