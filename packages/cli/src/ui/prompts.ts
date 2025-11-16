/*
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import * as p from "@clack/prompts";
import pc from "picocolors";

import type { InstallConfig, StylesheetFormat } from "../types.js";

export async function promptInstallConfig(defaultPath: string = "./src/styles"): Promise<InstallConfig> {
    p.intro(pc.bgBlue(pc.black(" Blueprint ")));

    const stylesPath = (await p.text({
        defaultValue: defaultPath,
        message: "Where would you like to install Blueprint styles?",
        placeholder: defaultPath,
        validate: value => {
            if (!value) return "Please provide a path";
        },
    })) as string;

    if (p.isCancel(stylesPath)) {
        p.cancel("Installation cancelled");
        process.exit(0);
    }

    const format = (await p.select({
        message: "Select your stylesheet format:",
        options: [
            {
                hint: "Customizable tokens with compile-time theming",
                label: "SCSS",
                value: "scss" as StylesheetFormat,
            },
            {
                hint: "Modern CSS custom properties with runtime theming",
                label: "CSS",
                value: "css" as StylesheetFormat,
            },
        ],
    })) as StylesheetFormat;

    if (p.isCancel(format)) {
        p.cancel("Installation cancelled");
        process.exit(0);
    }

    return {
        format,
        packageManager: "npm", // Will be detected separately
        stylesPath,
    };
}

export function showInstalling(): void {
    const spinner = p.spinner();
    spinner.start("Installing Blueprint packages...");
}

export function showSuccess(config: InstallConfig): void {
    p.outro(
        pc.green("Blueprint installed! ") +
            pc.cyan("🎨") +
            "\n\n" +
            (config.format === "scss"
                ? `${pc.bold("Your customizable theme is ready at:")}\n` +
                  `${pc.dim(config.stylesPath)}/tokens.scss\n\n` +
                  `${pc.bold("Next steps:")}\n` +
                  `${pc.dim("1.")} Import in your app root:\n` +
                  `   ${pc.cyan(`import '${config.stylesPath}/blueprint.scss'`)}\n\n` +
                  `${pc.dim("2.")} Customize your theme:\n` +
                  `   • Edit tokens.scss to change colors, spacing, etc.\n` +
                  `   • Your changes will apply at compile-time\n\n` +
                  `${pc.dim("3.")} Start using components:\n` +
                  `   ${pc.cyan("import { Button } from '@blueprintjs/core'")}`
                : `${pc.bold("Your CSS custom properties are at:")}\n` +
                  `${pc.dim(config.stylesPath)}/tokens.css\n\n` +
                  `${pc.bold("Next steps:")}\n` +
                  `${pc.dim("1.")} Import in your app root:\n` +
                  `   ${pc.cyan(`import '${config.stylesPath}/blueprint.css'`)}\n\n` +
                  `${pc.dim("2.")} Override CSS variables anywhere:\n` +
                  `   ${pc.cyan(":root { --color-blue-3: #your-color; }")}\n\n` +
                  `${pc.dim("3.")} Runtime theming is enabled!\n` +
                  `   Change CSS variables dynamically for themes`) +
            "\n\n" +
            `${pc.dim("Documentation:")} ${pc.underline("blueprintjs.com/docs")}`,
    );
}

export function showError(message: string): void {
    p.cancel(pc.red(message));
    process.exit(1);
}
