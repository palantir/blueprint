// doczrc.js
import { css } from "docz-plugin-css"
export default {
    title: "Blueprint",
    theme: "src/index",
    // wrapper: "src/wrapper",
    typescript: true,
    propsParser: false,
    plugins: [
        css(),
        css({ preprocessor: "sass" }),
    ],
    menu: [
        "Home",
        "Guides",
        "Components",
        "Resources"
    ],
    order: "ascending",
    hashRouter: true,
    base: "./",
    modifyBabelRc: (config) => {
        // legacy decorator support for babel + typescript
        config.plugins.push(["@babel/plugin-proposal-decorators", { legacy: true }]);
        return config;
    }
};
