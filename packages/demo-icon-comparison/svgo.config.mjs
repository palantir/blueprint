export default {
    js2svg: {
        indent: 2,
        pretty: true,
    },
    multipass: true,
    plugins: [
        "removeDimensions",
        {
            name: "removeAttrs",
            params: {
                attrs: [
                    "svg:(id|version|x|y|xml.space|xmlns.xlink|enable-background)",
                    "clip-rule|fill-rule|fill|id|stroke|stroke-width",
                ],
            },
        },
        "removeTitle",
        {
            name: "preset-default",
            params: {
                overrides: {
                    mergePaths: { force: true },
                },
            },
        },
    ],
};
